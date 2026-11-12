import { ChangeDetectionStrategy, Component, inject, input, signal } from '@angular/core';
import { BookForm } from '../../../components/book-form/book-form';
import { Modal } from '../../../shared/ui/modal';
import { DialogService } from '../../../core/ui/dialog.service';
import { ToastService } from '../../../core/ui/toast.service';
import { BooksStore } from '../store/books.store';
import { AuthorsStore } from '../../authors/store/authors.store';
import { GenresStore } from '../../genres/store/genres.store';
import { Book, CreateBookDto } from '../models/book';
import { ApiError } from '../../../core/models/api-error';
import { diffChanges } from '../../../shared/utils/diff-changes';

@Component({
  selector: 'app-book-dialog',
  imports: [BookForm, Modal],
  templateUrl: './book-dialog.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class BookDialog {
  readonly initialValue = input<Book | null>(null);
  readonly dialog = inject(DialogService);
  readonly books = inject(BooksStore);
  readonly authors = inject(AuthorsStore);
  readonly genres = inject(GenresStore);
  readonly toast = inject(ToastService);
  readonly saving = signal(false);
  readonly error = signal('');

  save(value: CreateBookDto): void {
    this.saving.set(true);
    this.error.set('');
    const original = this.initialValue();
    const changes = original ? diffChanges(original, value) : value;
    if (original && Object.keys(changes).length === 0) {
      this.saving.set(false);
      this.toast.show('No hay cambios que guardar');
      this.dialog.close();
      return;
    }
    const request = original ? this.books.update(original._id, changes) : this.books.create(value);
    request.subscribe({
      next: () => { this.toast.show(original ? 'Libro actualizado correctamente.' : 'Libro creado correctamente.'); this.dialog.close(); },
      error: (error: ApiError) => { this.error.set(error.message); this.saving.set(false); },
      complete: () => this.saving.set(false),
    });
  }
}
