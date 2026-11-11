import { Injectable } from '@angular/core';
import { ApiService } from '../../../core/api/api.service';
import { Book, CreateBookDto, UpdateBookDto } from '../models/book';

@Injectable({ providedIn: 'root' })
export class BookService extends ApiService<Book, CreateBookDto, UpdateBookDto> {
  protected readonly resource = 'books';
}
