export function diffChanges<T extends object>(
  original: T,
  value: Partial<T>,
): Partial<T> {
  const changes: Partial<T> = {};
  for (const key of Object.keys(value) as Array<keyof T>) {
    const current = value[key];
    const previous = original[key];
    const equal = key === 'genreIds' && Array.isArray(current) && Array.isArray(previous)
      ? current.length === previous.length && current.every((id) => previous.includes(id))
      : current === previous;
    if (!equal) {
      changes[key] = current;
    }
  }
  return changes;
}
