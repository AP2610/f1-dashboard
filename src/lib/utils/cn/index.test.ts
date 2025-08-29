import { cn } from '.';

describe('cn', () => {
  it('should return a space separated string', () => {
    expect(cn('class-1', 'class-2')).toBe('class-1 class-2');
  });

  it('should return a space separated string with a class that is an object with a truthy value which should be included in the output', () => {
    expect(cn('class-1', { 'class-2': true })).toBe('class-1 class-2');
  });

  it('should return a space separated string with a class that is an object with a falsy value which should be omitted from the output', () => {
    expect(cn('class-1', { 'class-2': false })).toBe('class-1');
  });

  it('should return a space separated string with a class that is an object with a truthy value which should be included in the output', () => {
    expect(cn('class-1', { 'class-2': true }, 'class-3')).toBe('class-1 class-2 class-3');
  });

  it('should return a space separated string with a class that is an object with a falsy value which should be omitted from the output', () => {
    expect(cn('class-1', { 'class-2': false }, 'class-3')).toBe('class-1 class-3');
  });
});
