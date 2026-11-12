import { TestBed } from '@angular/core/testing';
import { provideHttpClient } from '@angular/common/http';
import { provideHttpClientTesting, HttpTestingController } from '@angular/common/http/testing';
import { API_BASE_URL } from '../../../core/config/api.config';
import { Loan } from '../models/loan';
import { LoansStore } from './loans.store';

const sampleLoan = (returned = false): Loan => ({
  _id: 'loan-1',
  bookId: 'book-1',
  userName: 'Ana',
  loanDate: '2026-11-11T17:00:00.000Z',
  returned,
  ...(returned ? { returnDate: '2026-11-12T17:00:00.000Z' } : {}),
  createdAt: '2026-11-11T17:00:00.000Z',
  updatedAt: '2026-11-11T17:00:00.000Z',
});

describe('LoansStore', () => {
  let store: LoansStore;
  let http: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        LoansStore,
        provideHttpClient(),
        provideHttpClientTesting(),
        { provide: API_BASE_URL, useValue: 'http://localhost:3000/api/v1' },
      ],
    });
    store = TestBed.inject(LoansStore);
    http = TestBed.inject(HttpTestingController);
  });

  afterEach(() => http.verify());

  it('adds a created loan to the signal', () => {
    const loan = sampleLoan();
    store.create({ bookId: loan.bookId, userName: loan.userName, loanDate: loan.loanDate }).subscribe();
    http.expectOne({ method: 'POST', url: 'http://localhost:3000/api/v1/loans' }).flush(loan);
    expect(store.items()).toEqual([loan]);
  });

  it('replaces a loan after returning it', () => {
    const loan = sampleLoan();
    const returned = sampleLoan(true);
    store.items.set([loan]);
    store.returnLoan(loan._id).subscribe();
    http.expectOne({ method: 'PUT', url: 'http://localhost:3000/api/v1/loans/loan-1' }).flush(returned);
    expect(store.items()).toEqual([returned]);
  });

  it('removes a deleted loan from the signal', () => {
    const loan = sampleLoan();
    store.items.set([loan]);
    store.remove(loan._id).subscribe();
    http.expectOne({ method: 'DELETE', url: 'http://localhost:3000/api/v1/loans/loan-1' }).flush(null);
    expect(store.items()).toEqual([]);
  });
});
