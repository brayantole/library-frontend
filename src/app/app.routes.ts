import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: '',
    loadComponent: () => import('./features/books/pages/books-page').then((module) => module.BooksPage),
  },
  {
    path: 'loans',
    loadComponent: () => import('./features/loans/pages/loans-page').then((module) => module.LoansPage),
  },
];
