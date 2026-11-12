import { ChangeDetectionStrategy, Component, inject, input, signal } from '@angular/core';
import { Modal } from '../../../shared/ui/modal';
import { DialogService } from '../../../core/ui/dialog.service';
import { ToastService } from '../../../core/ui/toast.service';
import { BooksStore } from '../../books/store/books.store';
import { LoansStore } from '../store/loans.store';
import { Loan } from '../models/loan';
import { LoanForm, LoanFormValue } from './loan-form';
import { ApiError } from '../../../core/models/api-error';
import { diffChanges } from '../../../shared/utils/diff-changes';
import { dateInputToIso, isoToDateInput } from '../../../shared/utils/date';

@Component({
  selector: 'app-loan-dialog',
  imports: [Modal, LoanForm],
  templateUrl: './loan-dialog.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class LoanDialog {
  readonly initialValue = input<Loan | null>(null);
  readonly bookId = input<string | null>(null);
  readonly dialog = inject(DialogService);
  readonly books = inject(BooksStore);
  readonly loans = inject(LoansStore);
  readonly toast = inject(ToastService);
  readonly saving = signal(false);
  readonly error = signal('');

  save(value: LoanFormValue): void {
    this.saving.set(true);
    this.error.set('');
    const original = this.initialValue();
    const payload = original
      ? diffChanges({ userName: original.userName, loanDate: dateInputToIso(isoToDateInput(original.loanDate)) }, { userName: value.userName, loanDate: value.loanDate })
      : value;
    if (original && Object.keys(payload).length === 0) {
      this.saving.set(false);
      this.toast.show('No hay cambios que guardar');
      this.dialog.close();
      return;
    }
    const request = original ? this.loans.update(original._id, payload) : this.loans.create(value);
    request.subscribe({
      next: (loan) => {
        this.books.refreshOne(loan.bookId).subscribe({
          error: (refreshError: ApiError) => this.toast.show(refreshError.message),
        });
        this.toast.show(original ? 'Préstamo actualizado.' : 'Préstamo registrado.');
        this.dialog.close();
      },
      error: (error: ApiError) => { this.error.set(error.message); this.saving.set(false); },
      complete: () => this.saving.set(false),
    });
  }
}
