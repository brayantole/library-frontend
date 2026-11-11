export interface Loan {
  _id: string;
  bookId: string;
  userName: string;
  loanDate: string;
  returnDate?: string;
  returned: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface CreateLoanDto {
  bookId: string;
  userName: string;
  loanDate: string;
}

export type UpdateLoanDto = Partial<Pick<CreateLoanDto, 'userName' | 'loanDate'>> & {
  returned?: true;
};
