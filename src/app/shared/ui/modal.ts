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
  styles: [`
    .modal-backdrop { position: fixed; inset: 0; z-index: 10; display: grid; place-items: center; padding: 20px; background: #1725544d; }
    .modal { position: relative; width: min(460px, 100%); max-height: calc(100vh - 40px); overflow: auto; padding: 26px; }
    .close { position: absolute; top: 10px; right: 12px; color: #cbd5e1; background: transparent; border: 0; cursor: pointer; font-size: 24px; }
  `],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class Modal {
  readonly closed = output<void>();
}
