import { HttpErrorResponse } from '@angular/common/http';
import { ApiError } from '../core/models/api-error';

export function idAsString(id: string | undefined): string {
  return id?.trim() ?? '';
}

export function apiErrorMessage(error: HttpErrorResponse, fallback: string): string {
  const message = (error as unknown as ApiError).message ?? error.error?.message;
  return typeof message === 'string' ? message : fallback;
}
