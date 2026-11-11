import { Injectable } from '@angular/core';
import { ApiService } from '../core/api/api.service';
import { CreateLoanDto, Loan, UpdateLoanDto } from '../features/loans/models/loan';

@Injectable({ providedIn: 'root' })
export class LoanService extends ApiService<Loan, CreateLoanDto, UpdateLoanDto> {
  protected readonly resource = 'loans';

  returnLoan(id: string) {
    return this.update(id, { returned: true });
  }
}
