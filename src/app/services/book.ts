import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { CrearLibro, Libro } from '../models/library';

@Injectable({
  providedIn: 'root'
})
export class BookService {
  private http = inject(HttpClient);
  
  private readonly apiUrl = 'https://api-library-0zeb.onrender.com/api/v1/books';

  getBooks(): Observable<Libro[]> {
    return this.http.get<Libro[]>(this.apiUrl);
  }

  createBook(bookData: CrearLibro): Observable<Libro> {
    return this.http.post<Libro>(this.apiUrl, bookData);
  }

  deleteBook(id: string): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }
}