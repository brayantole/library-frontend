import { HttpErrorResponse, HttpInterceptorFn } from '@angular/common/http';
import { catchError, throwError } from 'rxjs';
import { ApiError } from '../models/api-error';

export const errorInterceptor: HttpInterceptorFn = (request, next) => next(request).pipe(
  catchError((error: HttpErrorResponse) => throwError(() => normalizeApiError(error))),
);

export function normalizeApiError(error: HttpErrorResponse): ApiError {
  const message = typeof error.error?.message === 'string'
    ? error.error.message
    : error.status === 0
      ? 'No se pudo conectar con el servidor. Inténtalo de nuevo.'
      : 'Ha ocurrido un error inesperado.';
  return { status: 'error', message };
}
