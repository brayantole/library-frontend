import { Book } from '../../books/models/book';
import { Loan } from '../models/loan';

export type LoanStatus = 'all' | 'active' | 'returned';

export function visibleLoans(loans: Loan[], books: Book[], status: LoanStatus, searchTerm: string): Loan[] {
  const search = searchTerm.trim().toLocaleLowerCase();
  return loans
    .filter((loan) => status === 'all' || (status === 'active' ? !loan.returned : loan.returned))
    .filter((loan) => {
      const title = books.find((book) => book._id === loan.bookId)?.title ?? 'Libro eliminado';
      return !search || loan.userName.toLocaleLowerCase().includes(search) || title.toLocaleLowerCase().includes(search);
    })
    .sort((a, b) => Number(a.returned) - Number(b.returned) || new Date(b.loanDate).getTime() - new Date(a.loanDate).getTime());
}
