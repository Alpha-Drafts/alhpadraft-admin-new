/**
 * Utility functions for formatting numbers in various ways,
 * such as adding commas, formatting as currency, percent, or short forms.
 */

// Formats a number with commas as thousand separators (e.g., 1,000)
// Example: formatNumberWithCommas(1234567) // "1,234,567"
export const formatNumberWithCommas = (num: number): string =>
  typeof num === "number" ? num.toLocaleString() : "";

// Formats a number to two decimal places (e.g., 123.46)
// Example: formatNumberToFixed2(123.456) // "123.46"
export const formatNumberToFixed2 = (num: number): string =>
  typeof num === "number" ? num.toFixed(2) : "";

// Formats a number as a currency string (e.g., $1,234.56)
// Example: formatNumberAsCurrency(1234.56) // "$1,234.56"
// Example: formatNumberAsCurrency(1234.56, "EUR") // "€1,234.56"
export const formatNumberAsCurrency = (
  num: number,
  currency: string = "USD",
  locale: string = "en-US",
): string =>
  typeof num === "number"
    ? num.toLocaleString(locale, {
        style: "currency",
        currency,
      })
    : "";

// Formats a number as a percentage string (e.g., 12.3%)
// Example: formatNumberAsPercent(0.123) // "12.3%"
// Example: formatNumberAsPercent(0.12345, 3) // "12.345%"
export const formatNumberAsPercent = (
  num: number,
  fractionDigits: number = 1,
): string =>
  typeof num === "number" ? `${(num * 100).toFixed(fractionDigits)}%` : "";

// Formats a number using a specific locale and options
// Example: formatNumberWithLocale(1234567.89, "de-DE") // "1.234.567,89"
// Example: formatNumberWithLocale(1234567.89, "en-IN") // "12,34,567.89"
export const formatNumberWithLocale = (
  num: number,
  locale: string = "en-US",
  options?: Intl.NumberFormatOptions,
): string =>
  typeof num === "number" ? num.toLocaleString(locale, options) : "";

// Formats a number in short form (e.g., 1.2K, 3.4M)
// Example: formatNumberAsShortForm(1234) // "1.2K"
// Example: formatNumberAsShortForm(1234567) // "1.2M"
// Example: formatNumberAsShortForm(123) // "123"
export const formatNumberAsShortForm = (num: number): string => {
  if (typeof num !== "number") return "";
  if (num >= 1_000_000) return `${(num / 1_000_000).toFixed(1)}M`;
  if (num >= 1_000) return `${(num / 1_000).toFixed(1)}K`;
  return num.toString();
};
