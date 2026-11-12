import { TestBed } from '@angular/core/testing';
import { provideHttpClient } from '@angular/common/http';
import { provideHttpClientTesting, HttpTestingController } from '@angular/common/http/testing';
import { API_BASE_URL } from '../../../core/config/api.config';
import { Book } from '../models/book';
import { BooksStore } from './books.store';

const book = (title: string): Book => ({
  _id: 'book-1', title, isbn: '1234567890', available: true, authorId: 'author-1',
  genreIds: [], author: null, genres: [], createdAt: '', updatedAt: '',
});

describe('BooksStore refreshOne', () => {
  it('replaces the requested book in the signal', () => {
    TestBed.configureTestingModule({
      providers: [
        BooksStore,
        provideHttpClient(),
        provideHttpClientTesting(),
        { provide: API_BASE_URL, useValue: 'http://localhost:3000/api/v1' },
      ],
    });
    const store = TestBed.inject(BooksStore);
    const http = TestBed.inject(HttpTestingController);
    store.items.set([book('Anterior')]);
    store.refreshOne('book-1').subscribe();
    http.expectOne({ method: 'GET', url: 'http://localhost:3000/api/v1/books/book-1' }).flush(book('Actualizado'));
    expect(store.items()[0].title).toBe('Actualizado');
    http.verify();
  });
});
