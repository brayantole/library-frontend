import { describe, expect, it } from 'vitest';
import { dateInputToIso, isoToDateInput } from './date';

describe('loan date utilities', () => {
  it('uses the same calendar day when converting to ISO and back', () => {
    const iso = dateInputToIso('2026-11-11');
    expect(isoToDateInput(iso)).toBe('2026-11-11');
  });
});
