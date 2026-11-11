import { HttpClient } from '@angular/common/http';
import { inject } from '@angular/core';
import { Observable } from 'rxjs';
import { API_BASE_URL } from '../config/api.config';

export abstract class ApiService<T, TCreate, TUpdate = Partial<TCreate>> {
  protected abstract readonly resource: string;
  private readonly http = inject(HttpClient);
  private readonly baseUrl = inject(API_BASE_URL);

  protected get url(): string {
    return `${this.baseUrl}/${this.resource}`;
  }

  getAll(): Observable<T[]> {
    return this.http.get<T[]>(this.url);
  }

  getById(id: string): Observable<T> {
    return this.http.get<T>(`${this.url}/${id}`);
  }

  create(value: TCreate): Observable<T> {
    return this.http.post<T>(this.url, value);
  }

  update(id: string, value: TUpdate): Observable<T> {
    return this.http.put<T>(`${this.url}/${id}`, value);
  }

  delete(id: string): Observable<void> {
    return this.http.delete<void>(`${this.url}/${id}`);
  }
}
