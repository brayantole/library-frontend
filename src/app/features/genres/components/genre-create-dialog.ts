import { ChangeDetectionStrategy, Component, inject, signal } from '@angular/core';
import { EntityForm, EntityFormValue } from '../../../components/entity-form/entity-form';
import { Modal } from '../../../shared/ui/modal';
import { DialogService } from '../../../core/ui/dialog.service';
import { ToastService } from '../../../core/ui/toast.service';
import { GenresStore } from '../store/genres.store';
import { ApiError } from '../../../core/models/api-error';

@Component({
  selector: 'app-genre-create-dialog',
  imports: [EntityForm, Modal],
  template: `<app-modal (closed)="dialog.close()"><h2>Añadir categoría</h2><app-entity-form nameLabel="Nombre" extraLabel="Descripción" nameId="genre-name" extraId="genre-description" [saving]="saving()" [errorMessage]="error()" (submitted)="save($event)" /></app-modal>`,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class GenreCreateDialog {
  readonly dialog = inject(DialogService);
  readonly genres = inject(GenresStore);
  readonly toast = inject(ToastService);
  readonly saving = signal(false);
  readonly error = signal('');

  save(value: EntityFormValue): void {
    this.saving.set(true);
    this.error.set('');
    this.genres.create({ name: value.name, description: value.extra }).subscribe({
      next: () => { this.toast.show('Categoría creada correctamente.'); this.dialog.close(); },
      error: (error: ApiError) => this.error.set(error.message),
      complete: () => this.saving.set(false),
    });
  }
}
