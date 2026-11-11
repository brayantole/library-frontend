import { TestBed } from '@angular/core/testing';
import { provideHttpClient } from '@angular/common/http';
import { API_BASE_URL } from '../../../core/config/api.config';
import { BookService } from './book.service';

describe('BookService', () => {
  it('should be created', () => {
    TestBed.configureTestingModule({
      providers: [
        provideHttpClient(),
        { provide: API_BASE_URL, useValue: 'http://localhost:3000/api/v1' },
      ],
    });
    expect(TestBed.inject(BookService)).toBeTruthy();
  });
});
