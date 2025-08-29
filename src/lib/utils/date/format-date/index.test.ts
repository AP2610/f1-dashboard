import { formatDate, formatDateNumeric } from './index';

describe('formatDate', () => {
  it('Adds correct ordinal suffixes', () => {
    expect(formatDate(new Date('2025-01-01'))).toContain('1st');
    expect(formatDate(new Date('2025-01-02'))).toContain('2nd');
    expect(formatDate(new Date('2025-01-03'))).toContain('3rd');
    expect(formatDate(new Date('2025-01-04'))).toContain('4th');
    expect(formatDate(new Date('2025-01-21'))).toContain('21st');
  });

  it('Produces full format by default', () => {
    const result = formatDate(new Date('2025-01-15T14:30:00'));
    expect(result).toMatch(/^Wednesday, 15th January 2025 at \d{1,2}:\d{2}$/);
  });

  it('Produces full format without time', () => {
    const result = formatDate(new Date('2025-01-15T14:30:00'), {}, true);
    expect(result).toMatch(/^Wednesday, 15th January 2025$/);
  });

  it('Handles different input types', () => {
    const date = new Date('2025-01-15');
    expect(formatDate(date)).toContain('15th');
    expect(formatDate(date.toISOString())).toContain('15th');
    expect(formatDate(date.getTime())).toContain('15th');
  });

  it('Respects custom options', () => {
    const result = formatDate(new Date('2025-01-15'), {
      weekday: 'short',
      month: 'short',
      year: '2-digit',
    });
    expect(result).toContain('Wed');
    expect(result).toContain('Jan');
    expect(result).toContain('25');
  });
});

describe('formatDateNumeric', () => {
  it('Produces DD-MM-YYYY format by default', () => {
    const result = formatDateNumeric(new Date('2025-01-15'));
    expect(result).toBe('15-01-2025');
  });

  it('Allows custom separator', () => {
    const result = formatDateNumeric(new Date('2025-01-15'), '/');
    expect(result).toBe('15/01/2025');
  });

  it('Handles different input types', () => {
    const date = new Date('2025-01-15');
    expect(formatDateNumeric(date)).toBe('15-01-2025');
    expect(formatDateNumeric(date.toISOString())).toBe('15-01-2025');
    expect(formatDateNumeric(date.getTime())).toBe('15-01-2025');
  });

  it('Pads single digits with zeros', () => {
    const result = formatDateNumeric(new Date('2025-01-05'));
    expect(result).toBe('05-01-2025');
  });
});
