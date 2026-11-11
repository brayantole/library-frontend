import { Injectable, signal } from '@angular/core';
import { Observable } from 'rxjs';
import { ApiError } from '../models/api-error';
import { ToastService } from './toast.service';

interface Confirmation {
  title: string;
  message: string;
  action: () => Observable<void>;
}

@Injectable({ providedIn: 'root' })
export class ConfirmService {
  readonly active = signal<Confirmation | null>(null);
  readonly working = signal(false);
  readonly error = signal('');

  constructor(private readonly toast: ToastService) {}

  confirmDelete(confirmation: Confirmation): void {
    this.error.set('');
    this.active.set(confirmation);
  }

  accept(): void {
    const confirmation = this.active();
    if (!confirmation || this.working()) {
      return;
    }
    this.working.set(true);
    this.error.set('');
    confirmation.action().subscribe({
      next: () => {
        this.active.set(null);
        this.toast.show('Elemento eliminado correctamente.');
      },
      error: (error: ApiError) => {
        this.error.set(error.message);
        this.working.set(false);
      },
      complete: () => this.working.set(false),
    });
  }

  cancel(): void {
    if (!this.working()) {
      this.active.set(null);
      this.error.set('');
    }
  }
}
