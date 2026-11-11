import { ChangeDetectionStrategy, Component, input, output } from '@angular/core';

@Component({
  selector: 'app-confirm-dialog',
  template: `
    <div class="modal-backdrop" (click)="cancelled.emit()">
      <section class="confirm-modal glass-surface" role="alertdialog" aria-modal="true" (click)="$event.stopPropagation()">
        <h2>{{ title() }}</h2>
        <p>{{ message() }}</p>
        @if (error()) { <p class="error" role="alert">{{ error() }}</p> }
        <div class="confirm-actions">
          <button type="button" class="cancel-button" [disabled]="working()" (click)="cancelled.emit()">{{ cancelLabel() }}</button>
          <button type="button" class="delete-button" [disabled]="working()" (click)="confirmed.emit()">
            {{ working() ? workingLabel() : confirmLabel() }}
          </button>
        </div>
      </section>
    </div>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ConfirmDialog {
  readonly title = input.required<string>();
  readonly message = input.required<string>();
  readonly confirmLabel = input('Eliminar');
  readonly cancelLabel = input('Cancelar');
  readonly workingLabel = input('Eliminando...');
  readonly working = input(false);
  readonly error = input('');
  readonly confirmed = output<void>();
  readonly cancelled = output<void>();
}
