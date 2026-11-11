import { Injectable, inject } from '@angular/core';
import { tap } from 'rxjs';
import { EntityStore } from '../../../core/store/entity.store';
import { CreateLoanDto, Loan, UpdateLoanDto } from '../models/loan';
import { LoanService } from '../services/loan.service';

@Injectable({ providedIn: 'root' })
export class LoansStore extends EntityStore<Loan, CreateLoanDto, UpdateLoanDto> {
  private readonly loanService = inject(LoanService);

  constructor() {
    super(inject(LoanService));
  }

  returnLoan(id: string) {
    return this.loanService.returnLoan(id).pipe(
      tap((loan) => this.items.update((items) => items.map((current) => current._id === id ? loan : current))),
    );
  }
}
