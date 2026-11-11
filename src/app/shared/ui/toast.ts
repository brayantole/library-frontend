import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { ToastService } from '../../core/ui/toast.service';

@Component({
  selector: 'app-toast',
  template: `
    @if (toast.message()) {
      <div class="toast" role="status">
        <span aria-hidden="true">✓</span>{{ toast.message() }}
        <button type="button" aria-label="Cerrar confirmación" (click)="toast.clear()">×</button>
      </div>
    }
  `,
  styles: [`
    :host { position: fixed; right: 24px; bottom: 24px; z-index: 20; }
    .toast { display: flex; gap: 10px; align-items: center; padding: 13px 15px; color: #ecfdf5; background: #064e3bcc; border: 1px solid #6ee7b7; border-radius: 12px; box-shadow: 0 12px 30px #0006; }
    button { color: inherit; background: transparent; border: 0; cursor: pointer; font-size: 18px; }
  `],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class Toast {
  readonly toast = inject(ToastService);
}
