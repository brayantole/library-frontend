import { ChangeDetectionStrategy, Component, inject, input, signal } from '@angular/core';
import { EntityForm, EntityFormValue } from '../../../components/entity-form/entity-form';
import { Modal } from '../../../shared/ui/modal';
import { DialogService } from '../../../core/ui/dialog.service';
import { ToastService } from '../../../core/ui/toast.service';
import { AuthorsStore } from '../store/authors.store';
import { Author } from '../models/author';
import { ApiError } from '../../../core/models/api-error';
import { BooksStore } from '../../books/store/books.store';
import { diffChanges } from '../../../shared/utils/diff-changes';

@Component({
  selector: 'app-author-dialog',
  imports: [EntityForm, Modal],
  templateUrl: './author-dialog.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AuthorDialog {
  readonly initialValue = input<Author | null>(null);
  readonly dialog = inject(DialogService);
  readonly authors = inject(AuthorsStore);
  readonly books = inject(BooksStore);
  readonly toast = inject(ToastService);
  readonly saving = signal(false);
  readonly error = signal('');

  save(value: EntityFormValue): void {
    this.saving.set(true);
    this.error.set('');
    const original = this.initialValue();
    const changes = original ? diffChanges({ name: original.name, extra: original.nationality, birthYear: original.birthYear }, value) : null;
    if (original && changes && Object.keys(changes).length === 0) {
      this.saving.set(false); this.toast.show('No hay cambios que guardar'); this.dialog.close(); return;
    }
    const request = original
      ? this.authors.update(original._id, {
        ...(changes?.name === undefined ? {} : { name: changes.name }),
        ...(changes?.extra === undefined ? {} : { nationality: changes.extra }),
        ...(changes?.birthYear === undefined ? {} : { birthYear: changes.birthYear }),
      })
      : this.authors.create({ name: value.name, nationality: value.extra ?? '', ...(value.birthYear === undefined ? {} : { birthYear: value.birthYear }) });
    request.subscribe({
      next: (author) => { this.books.syncAuthor(author); this.toast.show(original ? 'Autor actualizado correctamente.' : 'Autor creado correctamente.'); this.dialog.close(); },
      error: (error: ApiError) => { this.error.set(error.message); this.saving.set(false); },
      complete: () => this.saving.set(false),
    });
  }
}
