import { ChangeDetectionStrategy, Component, input, output } from '@angular/core';

@Component({
  selector: 'app-modal',
  template: `
    <div class="modal-backdrop" (click)="closed.emit()">
      <section class="modal glass-surface" role="dialog" aria-modal="true" (click)="$event.stopPropagation()">
        <button class="close" type="button" aria-label="Cerrar" (click)="closed.emit()">×</button>
        <ng-content />
      </section>
    </div>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class Modal {
  readonly closed = output<void>();
}
