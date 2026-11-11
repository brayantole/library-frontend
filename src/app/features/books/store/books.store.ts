import { Injectable, computed, inject, signal } from '@angular/core';
import { EntityStore } from '../../../core/store/entity.store';
import { Book, CreateBookDto, UpdateBookDto } from '../models/book';
import { BookService } from '../services/book.service';

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

  constructor() {
    super(inject(BookService));
  }
}
