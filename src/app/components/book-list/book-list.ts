import { ChangeDetectionStrategy, Component, input, output } from '@angular/core';
import { Book } from '../../features/books/models/book';
import { GlassButton } from '../glass-button/glass-button';

@Component({
  selector: 'app-book-list',
  imports: [GlassButton],
  templateUrl: './book-list.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class BookList {
  readonly books = input.required<Book[]>();
  readonly loading = input(false);
  readonly loaded = input(false);
  readonly deletingId = input<string | null>(null);
  readonly deleteRequested = output<Book>();

  bookId(book: Book): string {
    return book._id;
  }

  genreNames(book: Book): string {
    return (book.genres ?? []).map((genre) => genre.name).join(', ');
  }
}
