import { Injectable, computed, inject, signal } from '@angular/core';
import { Observable, tap } from 'rxjs';
import { EntityStore } from '../../../core/store/entity.store';
import { Book, CreateBookDto, UpdateBookDto } from '../models/book';
import { BookService } from '../services/book.service';
import { Author } from '../../authors/models/author';
import { Genre } from '../../genres/models/genre';

@Injectable({ providedIn: 'root' })
export class BooksStore extends EntityStore<Book, CreateBookDto, UpdateBookDto> {
  readonly selectedAuthorIds = signal<string[]>([]);
  readonly selectedGenreIds = signal<string[]>([]);
  readonly searchTerm = signal('');
  readonly filteredBooks = computed(() => {
    const search = this.searchTerm().trim().toLocaleLowerCase();
    return this.items().filter((book) =>
      (this.selectedAuthorIds().length === 0 || this.selectedAuthorIds().includes(book.authorId))
      && (this.selectedGenreIds().length === 0 || book.genreIds.some((id) => this.selectedGenreIds().includes(id)))
      && (!search || book.title.toLocaleLowerCase().includes(search) || book.author?.name.toLocaleLowerCase().includes(search)));
  });

  setFilters(authorIds: string[], genreIds: string[]): void {
    this.selectedAuthorIds.set(authorIds);
    this.selectedGenreIds.set(genreIds);
  }

  clearFilters(): void {
    this.setFilters([], []);
  }

  syncAuthor(author: Author): void {
    this.items.update((books) => books.map((book) => book.authorId === author._id ? { ...book, author } : book));
  }

  syncGenre(genre: Genre): void {
    this.items.update((books) => books.map((book) => book.genreIds.includes(genre._id)
      ? { ...book, genres: book.genres.map((item) => item._id === genre._id ? genre : item) }
      : book));
  }

  refreshOne(id: string): Observable<Book> {
    return this.service.getById(id).pipe(
      tap((book) => this.items.update((items) => items.map((current) => current._id === id ? book : current))),
    );
  }

  constructor() {
    super(inject(BookService));
  }
}
