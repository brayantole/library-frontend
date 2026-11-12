import { Injectable, signal } from '@angular/core';
import { Book } from '../../features/books/models/book';
import { Author } from '../../features/authors/models/author';
import { Genre } from '../../features/genres/models/genre';
import { Loan } from '../../features/loans/models/loan';

export type DialogState =
  | { kind: 'book'; entity?: Book }
  | { kind: 'author'; entity?: Author }
  | { kind: 'genre'; entity?: Genre }
  | { kind: 'loan'; entity?: Loan; bookId?: string }
  | null;

@Injectable({ providedIn: 'root' })
export class DialogService {
  readonly active = signal<DialogState>(null);

  open(kind: 'book', entity?: Book): void;
  open(kind: 'author', entity?: Author): void;
  open(kind: 'genre', entity?: Genre): void;
  open(kind: 'loan', entity?: Loan, bookId?: string): void;
  open(kind: 'book' | 'author' | 'genre', entity?: Book | Author | Genre): void;
  open(kind: 'book' | 'author' | 'genre' | 'loan', entity?: Book | Author | Genre | Loan, bookId?: string): void {
    this.active.set(entity || bookId ? { kind, entity, bookId } as DialogState : { kind } as DialogState);
  }

  close(): void {
    this.active.set(null);
  }
}
