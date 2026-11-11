import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';
import { Autor } from '../models/library';

@Injectable({ providedIn: 'root' })
export class AuthorService {
  private readonly http = inject(HttpClient);
  private readonly apiUrl = 'https://api-library-0zeb.onrender.com/api/v1/authors';

  getAuthors(): Observable<Autor[]> {
    return this.http.get<Autor[]>(this.apiUrl);
  }

  createAuthor(author: { name: string; nationality: string }): Observable<Autor> {
    return this.http.post<Autor>(this.apiUrl, author);
  }

  deleteAuthor(id: string): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }
}
