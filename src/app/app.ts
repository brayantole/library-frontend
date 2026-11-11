import { ChangeDetectionStrategy, Component, computed, DestroyRef, HostListener, inject, signal } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { finalize } from 'rxjs';
import { HttpErrorResponse } from '@angular/common/http';
import { BookForm } from './components/book-form/book-form';
import { BookList } from './components/book-list/book-list';
import { AuthorService } from './services/author';
import { BookService } from './services/book';
import { GenreService } from './services/genre';
import { Autor, CrearLibro, Genero, Libro } from './models/library';
import { apiErrorMessage, idAsString, textAsKey } from './services/api-utils';
import { EntityForm, EntityFormValue } from './components/entity-form/entity-form';
import { AuthorFilter } from './components/author-filter/author-filter';
import { GlassButton } from './components/glass-button/glass-button';

type DeletionTarget =
  | { kind: 'book'; id: string; name: string }
  | { kind: 'author'; id: string; name: string }
  | { kind: 'genre'; id: string; name: string };

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [BookForm, BookList, EntityForm, AuthorFilter, GlassButton],
  templateUrl: './app.html',
  styleUrl: './app.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class App {
  private readonly bookService = inject(BookService);
  private readonly authorService = inject(AuthorService);
  private readonly genreService = inject(GenreService);
  private readonly destroyRef = inject(DestroyRef);

  readonly books = signal<Libro[]>([]);
  readonly authors = signal<Autor[]>([]);
  readonly genres = signal<Genero[]>([]);
  readonly autoresSeleccionados = signal<string[]>([]);
  readonly pendingAuthorIds = signal<string[]>([]);
  readonly categoriasSeleccionadas = signal<string[]>([]);
  readonly pendingCategoryIds = signal<string[]>([]);
  readonly authorFilterOpen = signal(false);
  readonly booksLoaded = signal(false);
  readonly booksLoading = signal(false);
  readonly saving = signal(false);
  readonly formError = signal('');
  readonly catalogError = signal('');
  readonly searchTerm = signal('');
  readonly activePanel = signal<'book' | 'author' | 'genre' | null>(null);
  readonly authorFormError = signal('');
  readonly genreFormError = signal('');
  readonly toast = signal('');
  readonly pendingDeletion = signal<DeletionTarget | null>(null);
  readonly borrando = signal<string | null>(null);
  readonly filteredBooks = computed(() => {
    const authorIds = this.autoresSeleccionados();
    const categoryIds = this.categoriasSeleccionadas();
    const selectedAuthorNames = this.authors()
      .filter((author) => authorIds.includes(idAsString(author._id)))
      .map((author) => textAsKey(author.name));
    const selectedCategoryNames = this.genres()
      .filter((category) => categoryIds.includes(idAsString(category._id)))
      .map((category) => textAsKey(category.name));
    const search = this.searchTerm().trim().toLocaleLowerCase();
    return this.books().filter((book) => {
      const authorKey = textAsKey(book.author?.name);
      const categoryKeys = (book.genres ?? []).map((genre) => textAsKey(genre.name));
      const authorMatches = authorIds.length === 0
        || (book.authorId !== undefined && authorIds.includes(idAsString(book.authorId)))
        || selectedAuthorNames.includes(authorKey);
      const categoryMatches = categoryIds.length === 0
        || (book.genreIds ?? []).some((id) => categoryIds.includes(idAsString(id)))
        || categoryKeys.some((key) => selectedCategoryNames.includes(key));
      const searchMatches = !search || book.title.toLocaleLowerCase().includes(search)
        || book.author?.name.toLocaleLowerCase().includes(search);
      return authorMatches && categoryMatches && searchMatches;
    });
  });

  constructor() {
    this.authorService.getAuthors().pipe(takeUntilDestroyed(this.destroyRef)).subscribe({
      next: (authors) => this.authors.set(authors),
      error: () => this.formError.set('No se pudo cargar la lista de autores.'),
    });
    this.genreService.getGenres().pipe(takeUntilDestroyed(this.destroyRef)).subscribe({
      next: (genres) => this.genres.set(genres),
      error: () => this.formError.set('No se pudo cargar la lista de géneros.'),
    });
  }

  @HostListener('window:keydown.escape')
  closeTransientMenus(): void {
    this.authorFilterOpen.set(false);
    this.activePanel.set(null);
    this.pendingDeletion.set(null);
  }

  loadBooks(): void {
    this.booksLoading.set(true);
    this.catalogError.set('');
    this.bookService.getBooks().pipe(takeUntilDestroyed(this.destroyRef)).subscribe({
      next: (books) => {
        this.books.set(books);
        this.booksLoaded.set(true);
        this.booksLoading.set(false);
      },
      error: () => {
        this.catalogError.set('No se pudo cargar el catálogo. Inténtalo de nuevo.');
        this.booksLoading.set(false);
      },
    });
  }

  toggleAuthorFilter(): void {
    if (this.authorFilterOpen()) {
      this.authorFilterOpen.set(false);
      return;
    }
    this.pendingAuthorIds.set([...this.autoresSeleccionados()]);
    this.pendingCategoryIds.set([...this.categoriasSeleccionadas()]);
    this.authorFilterOpen.set(true);
  }

  togglePendingAuthor(authorId: string): void {
    this.pendingAuthorIds.update((ids) => ids.includes(authorId)
      ? ids.filter((id) => id !== authorId)
      : [...ids, authorId]);
  }

  clearPendingAuthors(): void {
    this.pendingAuthorIds.set([]);
  }

  togglePendingCategory(categoryId: string): void {
    this.pendingCategoryIds.update((ids) => ids.includes(categoryId)
      ? ids.filter((id) => id !== categoryId)
      : [...ids, categoryId]);
  }

  clearPendingCategories(): void {
    this.pendingCategoryIds.set([]);
  }

  clearAllPendingFilters(): void {
    this.pendingAuthorIds.set([]);
    this.pendingCategoryIds.set([]);
  }

  clearAllFilters(): void {
    this.clearAllPendingFilters();
    this.autoresSeleccionados.set([]);
    this.categoriasSeleccionadas.set([]);
    this.loadBooks();
  }

  applyAuthorFilter(): void {
    this.autoresSeleccionados.set([...this.pendingAuthorIds()]);
    this.categoriasSeleccionadas.set([...this.pendingCategoryIds()]);
    this.authorFilterOpen.set(false);
    this.loadBooks();
  }

  authorId(author: Autor): string {
    return idAsString(author._id);
  }

  categoryId(category: Genero): string {
    return idAsString(category._id);
  }

  saveBook(book: CrearLibro): void {
    this.saving.set(true);
    this.formError.set('');
    this.bookService.createBook(book)
      .pipe(takeUntilDestroyed(this.destroyRef), finalize(() => this.saving.set(false))).subscribe({
      next: () => {
        this.toast.set('Libro creado correctamente.');
        this.closePanel();
        this.loadBooks();
      },
      error: (error: HttpErrorResponse) => {
        const message = apiErrorMessage(error, 'No se pudo guardar el libro. Revisa los datos e inténtalo de nuevo.');
        this.formError.set(message);
      },
    });
  }

  onSearch(event: Event): void {
    this.searchTerm.set((event.target as HTMLInputElement).value);
  }

  openPanel(panel: 'book' | 'author' | 'genre'): void {
    this.authorFilterOpen.set(false);
    this.activePanel.set(panel);
    this.formError.set('');
    this.authorFormError.set('');
    this.genreFormError.set('');
  }

  closePanel(): void {
    this.activePanel.set(null);
  }

  saveAuthor(value: EntityFormValue): void {
    this.saving.set(true);
    this.authorService.createAuthor({ name: value.name, nationality: value.extra ?? '' })
      .pipe(takeUntilDestroyed(this.destroyRef), finalize(() => this.saving.set(false))).subscribe({
        next: (author) => {
          this.authors.update((authors) => [author, ...authors]);
          this.toast.set('Autor creado correctamente.');
          this.closePanel();
        },
        error: (error: HttpErrorResponse) => {
          this.authorFormError.set(apiErrorMessage(error, 'No se pudo crear el autor.'));
        },
      });
  }

  saveGenre(value: EntityFormValue): void {
    this.saving.set(true);
    this.genreService.createGenre({ name: value.name, description: value.extra })
      .pipe(takeUntilDestroyed(this.destroyRef), finalize(() => this.saving.set(false))).subscribe({
        next: (genre) => {
          this.genres.update((genres) => [genre, ...genres]);
          this.toast.set('Categoría creada correctamente.');
          this.closePanel();
        },
        error: (error: HttpErrorResponse) => {
          this.genreFormError.set(apiErrorMessage(error, 'No se pudo crear la categoría.'));
        },
      });
  }

  clearToast(): void {
    this.toast.set('');
  }

  closeAuthorFilter(): void {
    this.authorFilterOpen.set(false);
  }

  requestBookDeletion(book: Libro): void {
    this.pendingDeletion.set({ kind: 'book', id: idAsString(book._id), name: book.title });
    this.closeAuthorFilter();
  }

  requestAuthorDeletion(author: Autor): void {
    this.pendingDeletion.set({ kind: 'author', id: idAsString(author._id), name: author.name });
    this.closeAuthorFilter();
  }

  requestCategoryDeletion(category: Genero): void {
    this.pendingDeletion.set({ kind: 'genre', id: idAsString(category._id), name: category.name });
    this.closeAuthorFilter();
  }

  cancelDeletion(): void {
    if (!this.borrando()) {
      this.pendingDeletion.set(null);
    }
  }

  confirmDeletion(): void {
    const target = this.pendingDeletion();
    if (!target || this.borrando()) {
      return;
    }

    this.borrando.set(target.id);
    const request = target.kind === 'book'
      ? this.bookService.deleteBook(target.id)
      : target.kind === 'author'
        ? this.authorService.deleteAuthor(target.id)
        : this.genreService.deleteGenre(target.id);

    request.pipe(
      takeUntilDestroyed(this.destroyRef),
      finalize(() => this.borrando.set(null)),
    ).subscribe({
      next: () => {
        if (target.kind === 'book') {
          this.books.update((books) => books.filter((book) => idAsString(book._id) !== target.id));
        } else if (target.kind === 'author') {
          this.authors.update((authors) => authors.filter((author) => idAsString(author._id) !== target.id));
          this.autoresSeleccionados.update((ids) => ids.filter((id) => id !== target.id));
          this.pendingAuthorIds.update((ids) => ids.filter((id) => id !== target.id));
        } else {
          this.genres.update((genres) => genres.filter((genre) => idAsString(genre._id) !== target.id));
          this.categoriasSeleccionadas.update((ids) => ids.filter((id) => id !== target.id));
          this.pendingCategoryIds.update((ids) => ids.filter((id) => id !== target.id));
        }
        this.pendingDeletion.set(null);
        this.toast.set(`${this.entityLabel(target.kind)} eliminado correctamente.`);
      },
      error: (error: HttpErrorResponse) => {
        this.toast.set(apiErrorMessage(error, `No se pudo eliminar ${this.entityLabel(target.kind)}.`));
      },
    });
  }

  entityLabel(kind: DeletionTarget['kind']): string {
    return kind === 'book' ? 'el libro' : kind === 'author' ? 'el autor' : 'la categoría';
  }
}
