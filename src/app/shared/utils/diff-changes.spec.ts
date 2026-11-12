import { describe, expect, it } from 'vitest';
import { diffChanges } from './diff-changes';

describe('diffChanges', () => {
  it('ignores genre order and returns no changes when values match', () => {
    expect(diffChanges(
      { title: 'Libro', genreIds: ['a', 'b'] },
      { title: 'Libro', genreIds: ['b', 'a'] },
    )).toEqual({});
  });

  it('returns only changed fields', () => {
    expect(diffChanges(
      { title: 'Anterior', isbn: '1234567890' },
      { title: 'Nuevo', isbn: '1234567890' },
    )).toEqual({ title: 'Nuevo' });
  });
});
