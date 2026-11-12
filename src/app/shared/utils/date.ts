export function formatDate(value: string): string {
  return new Intl.DateTimeFormat('es-CO', { dateStyle: 'medium' }).format(new Date(value));
}

export function dateInputToIso(value: string): string {
  return new Date(`${value}T12:00:00`).toISOString();
}

export function isoToDateInput(value: string): string {
  const date = new Date(value);
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

export function todayDateInput(): string {
  return isoToDateInput(new Date().toISOString());
}
