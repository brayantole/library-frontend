import { Injectable, signal } from '@angular/core';

export type DialogKind = 'book' | 'author' | 'genre' | null;

@Injectable({ providedIn: 'root' })
export class DialogService {
  readonly active = signal<DialogKind>(null);

  open(kind: Exclude<DialogKind, null>): void {
    this.active.set(kind);
  }

  close(): void {
    this.active.set(null);
  }
}
