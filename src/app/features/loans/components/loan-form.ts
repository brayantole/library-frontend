import { ChangeDetectionStrategy, Component, effect, input, output } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Book } from '../../books/models/book';
import { Loan } from '../models/loan';
import { dateInputToIso, isoToDateInput, todayDateInput } from '../../../shared/utils/date';

export interface LoanFormValue {
  bookId: string;
  userName: string;
  loanDate: string;
}

interface LoanControls {
  bookId: FormControl<string>;
  userName: FormControl<string>;
  loanDate: FormControl<string>;
}

@Component({
  selector: 'app-loan-form',
  imports: [ReactiveFormsModule],
  templateUrl: './loan-form.html',
  styleUrl: './loan-form.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class LoanForm {
  readonly books = input.required<Book[]>();
  readonly initialValue = input<Loan | null>(null);
  readonly selectedBookId = input<string | null>(null);
  readonly saving = input(false);
  readonly errorMessage = input('');
  readonly submitted = output<LoanFormValue>();

  readonly form = new FormGroup<LoanControls>({
    bookId: new FormControl('', { nonNullable: true, validators: [Validators.required] }),
    userName: new FormControl('', { nonNullable: true, validators: [Validators.required, Validators.minLength(2), Validators.maxLength(120)] }),
    loanDate: new FormControl(todayDateInput(), { nonNullable: true, validators: [Validators.required] }),
  });

  constructor() {
    effect(() => {
      const loan = this.initialValue();
      const bookId = loan?.bookId ?? this.selectedBookId();
      if (bookId) {
        this.form.controls.bookId.setValue(bookId);
      }
      if (loan) {
        this.form.patchValue({ userName: loan.userName, loanDate: isoToDateInput(loan.loanDate) });
        this.form.controls.bookId.disable();
      } else {
        this.form.controls.bookId.enable();
      }
    });
  }

  submit(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }
    const value = this.form.getRawValue();
    this.submitted.emit({ bookId: value.bookId, userName: value.userName.trim(), loanDate: dateInputToIso(value.loanDate) });
  }
}
