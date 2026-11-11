import { ChangeDetectionStrategy, Component, input, output } from '@angular/core';

@Component({
  selector: 'app-confirm-dialog',
  template: `
    <div class="modal-backdrop" (click)="cancelled.emit()">
      <section class="confirm-modal glass-surface" role="alertdialog" aria-modal="true" (click)="$event.stopPropagation()">
        <h2>{{ title() }}</h2>
        <p>{{ message() }}</p>
        <div class="confirm-actions">
          <button type="button" class="cancel-button" [disabled]="working()" (click)="cancelled.emit()">{{ cancelLabel() }}</button>
          <button type="button" class="delete-button" [disabled]="working()" (click)="confirmed.emit()">
            {{ working() ? workingLabel() : confirmLabel() }}
          </button>
        </div>
      </section>
    </div>
  `,
  styles: [`
    .modal-backdrop { position: fixed; inset: 0; z-index: 10; display: grid; place-items: center; padding: 20px; background: #1725544d; }
    .confirm-modal { width: min(420px, 100%); padding: 24px; }
    .confirm-actions { display: flex; justify-content: flex-end; gap: 10px; margin-top: 20px; }
    button { padding: 9px 14px; border-radius: 8px; cursor: pointer; }
    .cancel-button { color: #cbd5e1; background: transparent; border: 1px solid #94a3b8; }
    .delete-button { color: #fff; background: #be123c; border: 1px solid #fb7185; }
  `],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ConfirmDialog {
  readonly title = input.required<string>();
  readonly message = input.required<string>();
  readonly confirmLabel = input('Eliminar');
  readonly cancelLabel = input('Cancelar');
  readonly workingLabel = input('Eliminando...');
  readonly working = input(false);
  readonly confirmed = output<void>();
  readonly cancelled = output<void>();
}
