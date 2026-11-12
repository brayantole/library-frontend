import { ChangeDetectionStrategy, Component, input, output } from '@angular/core';
import { Book } from '../../features/books/models/book';
import { GlassButton } from '../glass-button/glass-button';

@Component({
  selector: 'app-book-list',
  imports: [GlassButton],
  templateUrl: './book-list.html',
  styleUrl: './book-list.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class BookList {
  readonly books = input.required<Book[]>();
  readonly loading = input(false);
  readonly loaded = input(false);
  readonly deleteRequested = output<Book>();
  readonly editRequested = output<Book>();
  readonly loanRequested = output<Book>();

  genreNames(book: Book): string {
    return (book.genres ?? []).map((genre) => genre.name).join(', ');
  }
}
