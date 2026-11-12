import { ChangeDetectionStrategy, Component, inject, input, signal } from '@angular/core';
import { EntityForm, EntityFormValue } from '../../../components/entity-form/entity-form';
import { Modal } from '../../../shared/ui/modal';
import { DialogService } from '../../../core/ui/dialog.service';
import { ToastService } from '../../../core/ui/toast.service';
import { GenresStore } from '../store/genres.store';
import { Genre } from '../models/genre';
import { ApiError } from '../../../core/models/api-error';
import { BooksStore } from '../../books/store/books.store';
import { diffChanges } from '../../../shared/utils/diff-changes';

@Component({
  selector: 'app-genre-dialog',
  imports: [EntityForm, Modal],
  templateUrl: './genre-dialog.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class GenreDialog {
  readonly initialValue = input<Genre | null>(null);
  readonly dialog = inject(DialogService);
  readonly genres = inject(GenresStore);
  readonly books = inject(BooksStore);
  readonly toast = inject(ToastService);
  readonly saving = signal(false);
  readonly error = signal('');

  save(value: EntityFormValue): void {
    this.saving.set(true);
    this.error.set('');
    const original = this.initialValue();
    const changes = original ? diffChanges({ name: original.name, extra: original.description }, value) : value;
    if (original && Object.keys(changes).length === 0) {
      this.saving.set(false); this.toast.show('No hay cambios que guardar'); this.dialog.close(); return;
    }
    const request = original ? this.genres.update(original._id, { name: changes.name, description: changes.extra }) : this.genres.create(value);
    request.subscribe({
      next: (genre) => { this.books.syncGenre(genre); this.toast.show(original ? 'Categoría actualizada correctamente.' : 'Categoría creada correctamente.'); this.dialog.close(); },
      error: (error: ApiError) => { this.error.set(error.message); this.saving.set(false); },
      complete: () => this.saving.set(false),
    });
  }
}
