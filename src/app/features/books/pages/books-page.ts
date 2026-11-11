import { ChangeDetectionStrategy, Component, inject, signal } from '@angular/core';
import { BookList } from '../../../components/book-list/book-list';
import { BooksStore } from '../store/books.store';
import { AuthorsStore } from '../../authors/store/authors.store';
import { GenresStore } from '../../genres/store/genres.store';
import { Book } from '../models/book';
import { Author } from '../../authors/models/author';
import { Genre } from '../../genres/models/genre';
import { ConfirmService } from '../../../core/ui/confirm.service';
import { CatalogFilter } from '../components/catalog-filter';

@Component({
  selector: 'app-books-page',
  imports: [BookList, CatalogFilter],
  templateUrl: './books-page.html',
  styleUrl: './books-page.scss',
  host: { '(window:keydown.escape)': 'closeTransientMenus()' },
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class BooksPage {
  readonly books = inject(BooksStore);
  readonly authors = inject(AuthorsStore);
  readonly genres = inject(GenresStore);
  readonly confirm = inject(ConfirmService);
  readonly filterOpen = signal(false);

  constructor() {
    this.books.load();
    this.authors.load();
    this.genres.load();
  }

  closeTransientMenus(): void {
    this.filterOpen.set(false);
  }

  search(event: Event): void {
    this.books.searchTerm.set((event.target as HTMLInputElement).value);
  }

  deleteBook(book: Book): void {
    this.confirm.confirmDelete({ title: `¿Eliminar ${book.title}?`, message: 'Esta acción no se puede deshacer.', action: () => this.books.remove(book._id) });
  }

  deleteAuthor(author: Author): void {
    this.confirm.confirmDelete({ title: `¿Eliminar ${author.name}?`, message: 'El backend rechazará autores asociados a libros.', action: () => this.authors.remove(author._id) });
  }

  deleteGenre(genre: Genre): void {
    this.confirm.confirmDelete({ title: `¿Eliminar ${genre.name}?`, message: 'El backend rechazará categorías asociadas a libros.', action: () => this.genres.remove(genre._id) });
  }
}
