import { TestBed } from '@angular/core/testing';
import { of } from 'rxjs';
import { App } from './app';
import { AuthorService } from './features/authors/services/author.service';
import { BookService } from './features/books/services/book.service';
import { GenreService } from './features/genres/services/genre.service';
import { API_BASE_URL } from './core/config/api.config';

describe('App', () => {
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [App],
      providers: [
        { provide: AuthorService, useValue: { getAll: () => of([]), create: () => of({}) } },
        { provide: BookService, useValue: { getAll: () => of([]), create: () => of({}) } },
        { provide: GenreService, useValue: { getAll: () => of([]), create: () => of({}) } },
        { provide: API_BASE_URL, useValue: 'http://localhost:3000/api/v1' },
      ],
    })
      .compileComponents();
  });

  it('should create the app', () => {
    const fixture = TestBed.createComponent(App);
    const app = fixture.componentInstance;
    expect(app).toBeTruthy();
  });

  it('should render title', async () => {
    const fixture = TestBed.createComponent(App);
    await fixture.whenStable();
    const compiled = fixture.nativeElement as HTMLElement;
    expect(compiled.querySelector('h1')?.textContent).toContain('Tu biblioteca');
  });

  it('filters books by the API author and genre IDs', () => {
    const fixture = TestBed.createComponent(App);
    const app = fixture.componentInstance;

    app.authors.set([{ _id: 'author-1', name: 'Autor Uno', nationality: 'ES', createdAt: '', updatedAt: '' }]);
    app.genres.set([{ _id: 'genre-1', name: 'Ficción', createdAt: '', updatedAt: '' }]);
    app.books.set([
      {
        _id: 'book-1',
        title: 'Libro filtrable',
        isbn: '1234567890',
        available: true,
        authorId: 'author-1',
        genreIds: ['genre-1'],
        createdAt: '',
        updatedAt: '',
        author: { _id: 'author-1', name: 'Autor Uno', nationality: 'ES', createdAt: '', updatedAt: '' },
        genres: [{ _id: 'genre-1', name: 'Ficción', createdAt: '', updatedAt: '' }],
      },
      {
        _id: 'book-2',
        title: 'Otro libro',
        isbn: '0987654321',
        available: true,
        authorId: 'author-2',
        genreIds: ['genre-2'],
        createdAt: '',
        updatedAt: '',
        author: { _id: 'author-2', name: 'Otro Autor', nationality: 'ES', createdAt: '', updatedAt: '' },
        genres: [{ _id: 'genre-2', name: 'Historia', createdAt: '', updatedAt: '' }],
      },
    ]);

    app.autoresSeleccionados.set(['author-1']);
    app.categoriasSeleccionadas.set(['genre-1']);

    expect(app.filteredBooks().map((book) => book.title)).toEqual(['Libro filtrable']);
  });
});
