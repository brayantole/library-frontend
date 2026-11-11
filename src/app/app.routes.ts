import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: '',
    loadComponent: () => import('./features/books/pages/books-page').then((module) => module.BooksPage),
  },
];
