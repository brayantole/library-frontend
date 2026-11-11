import { TestBed } from '@angular/core/testing';
import { of } from 'rxjs';
import { App } from './app';
import { AuthorService } from './services/author';
import { BookService } from './services/book';
import { GenreService } from './services/genre';

describe('App', () => {
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [App],
      providers: [
        { provide: AuthorService, useValue: { getAuthors: () => of([]) } },
        { provide: BookService, useValue: { getBooks: () => of([]), createBook: () => of({}) } },
        { provide: GenreService, useValue: { getGenres: () => of([]) } },
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

  it('filters real API books by related author and category names when IDs are omitted', () => {
    const fixture = TestBed.createComponent(App);
    const app = fixture.componentInstance;

    app.authors.set([{ _id: 'author-1', name: 'Autor Uno', nationality: 'ES' }]);
    app.genres.set([{ _id: 'genre-1', name: 'Ficción' }]);
    app.books.set([
      {
        _id: 'book-1',
        title: 'Libro filtrable',
        isbn: '1234567890',
        available: true,
        author: { name: 'Autor Uno', nationality: 'ES' },
        genres: [{ name: 'Ficción' }],
      },
      {
        _id: 'book-2',
        title: 'Otro libro',
        isbn: '0987654321',
        available: true,
        author: { name: 'Otro Autor', nationality: 'ES' },
        genres: [{ name: 'Historia' }],
      },
    ]);

    app.autoresSeleccionados.set(['author-1']);
    app.categoriasSeleccionadas.set(['genre-1']);

    expect(app.filteredBooks().map((book) => book.title)).toEqual(['Libro filtrable']);
  });
});
