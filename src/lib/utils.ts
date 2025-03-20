import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}


export function formatDate(
  date: Date | string | number,
  opts: Intl.DateTimeFormatOptions = {}
) {
  return new Intl.DateTimeFormat("en-US", {
    month: opts.month ?? "long",
    day: opts.day ?? "numeric",
    year: opts.year ?? "numeric",
    ...opts,
  }).format(new Date(date))
}

export const creators = ['community','admin'];
export const participators = ['participator'];

export function formatIndianNumber(number: string | number): string {
  let decimal = "";
  let numStr = number.toString();

  // Check for decimal part
  if (numStr.includes('.')) {
      const parts = numStr.split('.');
      numStr = parts[0];
      decimal = '.' + parts[1].substring(0, 2);  // Limiting to 2 decimal places
  }

  // If the number is less than 1,000, return as-is with the decimal part
  if (numStr.length <= 3) return numStr + decimal;

  // Get the last three digits
  const last3 = numStr.slice(-3);
  const rest = numStr.slice(0, -3);

  // Format the rest with pairs of digits
  const formatted = rest.replace(/\B(?=(\d{2})+(?!\d))/g, ',');
  return (formatted ? formatted + ',' : '') + last3 + decimal;
}