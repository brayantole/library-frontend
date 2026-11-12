import { describe, expect, it } from 'vitest';
import { visibleLoans } from './loan-view';
import { Loan } from '../models/loan';

const loan = (id: string, returned: boolean, userName: string, loanDate: string, bookId = 'book-1'): Loan => ({
  _id: id, bookId, userName, loanDate, returned, createdAt: loanDate, updatedAt: loanDate,
});

describe('visibleLoans', () => {
  it('filters by status and searches user or book title', () => {
    const loans = [loan('returned', true, 'Ana', '2026-01-03'), loan('active', false, 'Luis', '2026-01-01')];
    const books = [{ _id: 'book-1', title: 'Cien años', author: null } as never];
    expect(visibleLoans(loans, books, 'active', 'luis').map((item) => item._id)).toEqual(['active']);
    expect(visibleLoans(loans, books, 'all', 'cien').map((item) => item._id)).toEqual(['active', 'returned']);
  });
});
