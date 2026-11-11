import { ChangeDetectionStrategy, Component, inject, signal } from '@angular/core';
import { EntityForm, EntityFormValue } from '../../../components/entity-form/entity-form';
import { Modal } from '../../../shared/ui/modal';
import { DialogService } from '../../../core/ui/dialog.service';
import { ToastService } from '../../../core/ui/toast.service';
import { AuthorsStore } from '../store/authors.store';
import { ApiError } from '../../../core/models/api-error';

@Component({
  selector: 'app-author-create-dialog',
  imports: [EntityForm, Modal],
  template: `<app-modal (closed)="dialog.close()"><h2>Añadir autor</h2><app-entity-form nameLabel="Nombre" extraLabel="Nacionalidad" nameId="author-name" extraId="author-nationality" [extraRequired]="true" [saving]="saving()" [errorMessage]="error()" (submitted)="save($event)" /></app-modal>`,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AuthorCreateDialog {
  readonly dialog = inject(DialogService);
  readonly authors = inject(AuthorsStore);
  readonly toast = inject(ToastService);
  readonly saving = signal(false);
  readonly error = signal('');

  save(value: EntityFormValue): void {
    this.saving.set(true);
    this.error.set('');
    this.authors.create({ name: value.name, nationality: value.extra ?? '' }).subscribe({
      next: () => { this.toast.show('Autor creado correctamente.'); this.dialog.close(); },
      error: (error: ApiError) => this.error.set(error.message),
      complete: () => this.saving.set(false),
    });
  }
}
