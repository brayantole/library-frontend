import { ChangeDetectionStrategy, Component, computed, inject, signal } from '@angular/core';
import { map, tap } from 'rxjs';
import { GlassButton } from '../../../components/glass-button/glass-button';
import { BooksStore } from '../../books/store/books.store';
import { LoansStore } from '../store/loans.store';
import { Loan } from '../models/loan';
import { DialogService } from '../../../core/ui/dialog.service';
import { ConfirmService } from '../../../core/ui/confirm.service';
import { ToastService } from '../../../core/ui/toast.service';
import { ApiError } from '../../../core/models/api-error';
import { formatDate } from '../../../shared/utils/date';
import { LoanStatus, visibleLoans } from '../utils/loan-view';

@Component({
  selector: 'app-loans-page',
  imports: [GlassButton],
  templateUrl: './loans-page.html',
  styleUrl: './loans-page.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class LoansPage {
  readonly loans = inject(LoansStore);
  readonly books = inject(BooksStore);
  readonly dialog = inject(DialogService);
  readonly confirm = inject(ConfirmService);
  readonly toast = inject(ToastService);
  readonly status = signal<LoanStatus>('all');
  readonly searchTerm = signal('');
  readonly filteredLoans = computed(() => {
    return visibleLoans(this.loans.items(), this.books.items(), this.status(), this.searchTerm());
  });

  constructor() {
    this.loans.load();
    if (!this.books.loaded()) {
      this.books.load();
    }
  }

  bookTitle(loan: Loan): string {
    return this.books.items().find((book) => book._id === loan.bookId)?.title ?? 'Libro eliminado';
  }

  authorName(loan: Loan): string {
    return this.books.items().find((book) => book._id === loan.bookId)?.author?.name ?? 'Autor desconocido';
  }

  formatDate(value: string): string {
    return formatDate(value);
  }

  setSearch(event: Event): void {
    this.searchTerm.set((event.target as HTMLInputElement).value);
  }

  retry(): void {
    this.loans.load();
    if (!this.books.loaded()) {
      this.books.load();
    }
  }

  returnLoan(loan: Loan): void {
    this.loans.returnLoan(loan._id).pipe(
      tap((updated) => this.books.refreshOne(updated.bookId).subscribe({
        error: (refreshError: ApiError) => this.toast.show(refreshError.message),
      })),
    ).subscribe({
      next: () => this.toast.show('Libro devuelto.'),
      error: (error: ApiError) => { this.toast.show(error.message); this.loans.load(); },
    });
  }

  editLoan(loan: Loan): void {
    if (!loan.returned) {
      this.dialog.open('loan', loan);
    }
  }

  deleteLoan(loan: Loan): void {
    this.confirm.confirmDelete({
      title: `¿Eliminar préstamo de ${loan.userName}?`,
      message: 'Si el préstamo está activo, el libro volverá a estar disponible.',
      action: () => this.loans.remove(loan._id).pipe(
        tap(() => this.books.refreshOne(loan.bookId).subscribe({
          error: (refreshError: ApiError) => this.toast.show(refreshError.message),
        })),
        map(() => undefined),
      ),
    });
  }
}
