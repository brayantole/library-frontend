import { Injectable } from '@angular/core';
import { ApiService } from '../core/api/api.service';
import { Book, CreateBookDto, UpdateBookDto } from '../features/books/models/book';

@Injectable({ providedIn: 'root' })
export class BookService extends ApiService<Book, CreateBookDto, UpdateBookDto> {
  protected readonly resource = 'books';

  getBooks() { return this.getAll(); }
  createBook(book: CreateBookDto) { return this.create(book); }
  deleteBook(id: string) { return this.delete(id); }
}
