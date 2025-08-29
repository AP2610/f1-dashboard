// Adds ordinal suffix to a number (1st, 2nd, 3rd, etc.)
function getOrdinalSuffix(day: number): string {
  if (day > 3 && day < 21) return 'th';

  switch (day % 10) {
    case 1:
      return 'st';
    case 2:
      return 'nd';
    case 3:
      return 'rd';
    default:
      return 'th';
  }
}

// Formats a date with full text format including ordinal suffix
export function formatDate(
  date: Date | string | number,
  options: Intl.DateTimeFormatOptions = {},
  excludeTime: boolean = false,
  locale: string = 'en-GB',
): string {
  const dateObject = new Date(date);

  // Default options for a nice readable format
  const defaultOptions: Intl.DateTimeFormatOptions = {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
    timeZone: 'Europe/Amsterdam',
    ...options,
  };

  const fullFormat = new Intl.DateTimeFormat(locale, defaultOptions);
  const parts = fullFormat.formatToParts(dateObject);

  const weekday = parts.find((part) => part.type === 'weekday')?.value;
  const month = parts.find((part) => part.type === 'month')?.value;
  const day = parts.find((part) => part.type === 'day')?.value;
  const year = parts.find((part) => part.type === 'year')?.value;
  const hour = parts.find((part) => part.type === 'hour')?.value;
  const minute = parts.find((part) => part.type === 'minute')?.value;

  const dayWithSuffix = `${day}${getOrdinalSuffix(Number(day))}`;

  if (excludeTime) {
    return `${weekday}, ${dayWithSuffix} ${month} ${year}`;
  }

  return `${weekday}, ${dayWithSuffix} ${month} ${year} at ${hour}:${minute}`;
}

// Formats a date in numeric format (DD-MM-YYYY)
export function formatDateNumeric(date: Date | string | number, separator: string = '-'): string {
  const dateObject = new Date(date);
  const day = dateObject.getDate().toString().padStart(2, '0');
  const month = (dateObject.getMonth() + 1).toString().padStart(2, '0');
  const year = dateObject.getFullYear();
  return `${day}${separator}${month}${separator}${year}`;
}
