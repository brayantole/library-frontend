import { ChangeDetectionStrategy, Component, DestroyRef, HostListener, inject, signal } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { finalize } from 'rxjs';
import { BookForm } from './components/book-form/book-form';
import { BookList } from './components/book-list/book-list';
import { Author } from './features/authors/models/author';
import { CreateBookDto, Book } from './features/books/models/book';
import { Genre } from './features/genres/models/genre';
import { ApiError } from './core/models/api-error';
import { BooksStore } from './features/books/store/books.store';
import { AuthorsStore } from './features/authors/store/authors.store';
import { GenresStore } from './features/genres/store/genres.store';
import { EntityForm, EntityFormValue } from './components/entity-form/entity-form';
import { AuthorFilter } from './components/author-filter/author-filter';
import { GlassButton } from './components/glass-button/glass-button';
import { ToastService } from './core/ui/toast.service';
import { Toast } from './shared/ui/toast';
import { Modal } from './shared/ui/modal';
import { ConfirmDialog } from './shared/ui/confirm-dialog';

type DeletionTarget =
  | { kind: 'book'; id: string; name: string }
  | { kind: 'author'; id: string; name: string }
  | { kind: 'genre'; id: string; name: string };

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [BookForm, BookList, EntityForm, AuthorFilter, GlassButton, Toast, Modal, ConfirmDialog],
  templateUrl: './app.html',
  styleUrl: './app.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class App {
  readonly booksStore = inject(BooksStore);
  readonly authorsStore = inject(AuthorsStore);
  readonly genresStore = inject(GenresStore);
  readonly toastService = inject(ToastService);
  private readonly destroyRef = inject(DestroyRef);

  readonly books = this.booksStore.items;
  readonly authors = this.authorsStore.items;
  readonly genres = this.genresStore.items;
  readonly autoresSeleccionados = this.booksStore.selectedAuthorIds;
  readonly pendingAuthorIds = signal<string[]>([]);
  readonly categoriasSeleccionadas = this.booksStore.selectedGenreIds;
  readonly pendingCategoryIds = signal<string[]>([]);
  readonly authorFilterOpen = signal(false);
  readonly booksLoaded = this.booksStore.loaded;
  readonly booksLoading = this.booksStore.loading;
  readonly saving = signal(false);
  readonly formError = signal('');
  readonly catalogError = this.booksStore.error;
  readonly searchTerm = signal('');
  readonly activePanel = signal<'book' | 'author' | 'genre' | null>(null);
  readonly authorFormError = signal('');
  readonly genreFormError = signal('');
  readonly pendingDeletion = signal<DeletionTarget | null>(null);
  readonly borrando = signal<string | null>(null);
  readonly filteredBooks = this.booksStore.filteredBooks;

  constructor() {
    this.authorsStore.load();
    this.genresStore.load();
    this.loadBooks();
  }

  @HostListener('window:keydown.escape')
  closeTransientMenus(): void {
    this.authorFilterOpen.set(false);
    this.activePanel.set(null);
    this.pendingDeletion.set(null);
  }

  loadBooks(): void {
    this.booksStore.load();
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
    this.booksStore.selectedAuthorIds.set([]);
    this.booksStore.selectedGenreIds.set([]);
  }

  applyAuthorFilter(): void {
    this.autoresSeleccionados.set([...this.pendingAuthorIds()]);
    this.categoriasSeleccionadas.set([...this.pendingCategoryIds()]);
    this.booksStore.selectedAuthorIds.set([...this.pendingAuthorIds()]);
    this.booksStore.selectedGenreIds.set([...this.pendingCategoryIds()]);
    this.authorFilterOpen.set(false);
  }

  saveBook(book: CreateBookDto): void {
    this.saving.set(true);
    this.formError.set('');
    this.booksStore.create(book)
      .pipe(takeUntilDestroyed(this.destroyRef), finalize(() => this.saving.set(false))).subscribe({
      next: (book) => {
        this.toastService.show('Libro creado correctamente.');
        this.closePanel();
      },
      error: (error: ApiError) => {
        this.formError.set(this.errorMessage(error, 'No se pudo guardar el libro. Revisa los datos e inténtalo de nuevo.'));
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
    this.authorsStore.create({ name: value.name, nationality: value.extra ?? '' })
      .pipe(takeUntilDestroyed(this.destroyRef), finalize(() => this.saving.set(false))).subscribe({
        next: (author) => {
          this.toastService.show('Autor creado correctamente.');
          this.closePanel();
        },
        error: (error: ApiError) => {
          this.authorFormError.set(this.errorMessage(error, 'No se pudo crear el autor.'));
        },
      });
  }

  saveGenre(value: EntityFormValue): void {
    this.saving.set(true);
    this.genresStore.create({ name: value.name, description: value.extra })
      .pipe(takeUntilDestroyed(this.destroyRef), finalize(() => this.saving.set(false))).subscribe({
        next: (genre) => {
          this.toastService.show('Categoría creada correctamente.');
          this.closePanel();
        },
        error: (error: ApiError) => {
          this.genreFormError.set(this.errorMessage(error, 'No se pudo crear la categoría.'));
        },
      });
  }

  clearToast(): void {
    this.toastService.clear();
  }

  closeAuthorFilter(): void {
    this.authorFilterOpen.set(false);
  }

  requestBookDeletion(book: Book): void {
    this.pendingDeletion.set({ kind: 'book', id: book._id, name: book.title });
    this.closeAuthorFilter();
  }

  requestAuthorDeletion(author: Author): void {
    this.pendingDeletion.set({ kind: 'author', id: author._id, name: author.name });
    this.closeAuthorFilter();
  }

  requestCategoryDeletion(category: Genre): void {
    this.pendingDeletion.set({ kind: 'genre', id: category._id, name: category.name });
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
      ? this.booksStore.remove(target.id)
      : target.kind === 'author'
        ? this.authorsStore.remove(target.id)
        : this.genresStore.remove(target.id);

    request.pipe(
      takeUntilDestroyed(this.destroyRef),
      finalize(() => this.borrando.set(null)),
    ).subscribe({
      next: () => {
        if (target.kind === 'book') {
          this.booksStore.items.update((books) => books.filter((book) => book._id !== target.id));
        } else if (target.kind === 'author') {
          this.authorsStore.items.update((authors) => authors.filter((author) => author._id !== target.id));
          this.autoresSeleccionados.update((ids) => ids.filter((id) => id !== target.id));
          this.pendingAuthorIds.update((ids) => ids.filter((id) => id !== target.id));
        } else {
          this.genresStore.items.update((genres) => genres.filter((genre) => genre._id !== target.id));
          this.categoriasSeleccionadas.update((ids) => ids.filter((id) => id !== target.id));
          this.pendingCategoryIds.update((ids) => ids.filter((id) => id !== target.id));
        }
        this.pendingDeletion.set(null);
        this.toastService.show(`${this.entityLabel(target.kind)} eliminado correctamente.`);
      },
      error: (error: ApiError) => {
        this.toastService.show(this.errorMessage(error, `No se pudo eliminar ${this.entityLabel(target.kind)}.`));
      },
    });
  }

  entityLabel(kind: DeletionTarget['kind']): string {
    return kind === 'book' ? 'el libro' : kind === 'author' ? 'el autor' : 'la categoría';
  }

  private errorMessage(error: ApiError, fallback: string): string {
    return error?.message || fallback;
  }
}
