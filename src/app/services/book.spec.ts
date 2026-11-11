import { TestBed } from '@angular/core/testing';
import { provideHttpClient } from '@angular/common/http';
import { BookService } from '../features/books/services/book.service';
import { API_BASE_URL } from '../core/config/api.config';

describe('BookService', () => {
  let service: BookService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        provideHttpClient(),
        { provide: API_BASE_URL, useValue: 'http://localhost:3000/api/v1' },
      ],
    });
    service = TestBed.inject(BookService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
