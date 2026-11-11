import { signal } from '@angular/core';
import { EMPTY, Observable, catchError, finalize, tap, throwError } from 'rxjs';
import { ApiError } from '../models/api-error';
import { ApiService } from '../api/api.service';

export abstract class EntityStore<T extends { _id: string }, TCreate, TUpdate = Partial<TCreate>> {
  readonly items = signal<T[]>([]);
  readonly loading = signal(false);
  readonly loaded = signal(false);
  readonly error = signal('');

  protected constructor(protected readonly service: ApiService<T, TCreate, TUpdate>) {}

  load(): void {
    this.loading.set(true);
    this.error.set('');
    this.service.getAll().pipe(
      tap((items) => {
        this.items.set(items);
        this.loaded.set(true);
      }),
      catchError((error: ApiError) => {
        this.error.set(error.message);
        return EMPTY;
      }),
      finalize(() => this.loading.set(false)),
    ).subscribe();
  }

  create(value: TCreate): Observable<T> {
    return this.service.create(value).pipe(
      tap((item) => this.items.update((items) => [item, ...items])),
      catchError((error: ApiError) => {
        this.error.set(error.message);
        return throwError(() => error);
      }),
    );
  }

  update(id: string, value: TUpdate): Observable<T> {
    return this.service.update(id, value).pipe(
      tap((item) => this.items.update((items) => items.map((current) => current._id === id ? item : current))),
      catchError((error: ApiError) => {
        this.error.set(error.message);
        return throwError(() => error);
      }),
    );
  }

  remove(id: string): Observable<void> {
    return this.service.delete(id).pipe(
      tap(() => this.items.update((items) => items.filter((item) => item._id !== id))),
      catchError((error: ApiError) => {
        this.error.set(error.message);
        return throwError(() => error);
      }),
    );
  }
}
