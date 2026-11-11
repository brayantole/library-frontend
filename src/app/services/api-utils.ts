import { HttpErrorResponse } from '@angular/common/http';

export function idAsString(id: string | { toHexString(): string } | undefined): string {
  return id === undefined ? '' : typeof id === 'string' ? id.trim() : id.toHexString();
}

export function textAsKey(value: string | undefined): string {
  return value?.trim().toLocaleLowerCase() ?? '';
}

export function apiErrorMessage(error: HttpErrorResponse, fallback: string): string {
  const message = error.error?.message;
  return typeof message === 'string' ? message : fallback;
}
