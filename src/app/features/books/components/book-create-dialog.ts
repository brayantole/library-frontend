import { ChangeDetectionStrategy, Component, inject, signal } from '@angular/core';
import { BookForm } from '../../../components/book-form/book-form';
import { Modal } from '../../../shared/ui/modal';
import { DialogService } from '../../../core/ui/dialog.service';
import { ToastService } from '../../../core/ui/toast.service';
import { BooksStore } from '../store/books.store';
import { AuthorsStore } from '../../authors/store/authors.store';
import { GenresStore } from '../../genres/store/genres.store';
import { CreateBookDto } from '../models/book';
import { ApiError } from '../../../core/models/api-error';

@Component({
  selector: 'app-book-create-dialog',
  imports: [BookForm, Modal],
  template: `<app-modal (closed)="dialog.close()"><h2>Añadir libro</h2><app-book-form [authors]="authors.items()" [genres]="genres.items()" [saving]="saving()" [errorMessage]="error()" (submitted)="save($event)" /></app-modal>`,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class BookCreateDialog {
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
    this.books.create(value).subscribe({
      next: () => { this.toast.show('Libro creado correctamente.'); this.dialog.close(); },
      error: (error: ApiError) => this.error.set(error.message),
      complete: () => this.saving.set(false),
    });
  }
}
