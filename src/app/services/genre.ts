import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';
import { Genero } from '../models/library';

@Injectable({ providedIn: 'root' })
export class GenreService {
  private readonly http = inject(HttpClient);
  private readonly apiUrl = 'https://api-library-0zeb.onrender.com/api/v1/genres';

  getGenres(): Observable<Genero[]> {
    return this.http.get<Genero[]>(this.apiUrl);
  }

  createGenre(genre: { name: string; description?: string }): Observable<Genero> {
    return this.http.post<Genero>(this.apiUrl, genre);
  }

  deleteGenre(id: string): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }
}
