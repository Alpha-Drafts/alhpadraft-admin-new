/**
 *  @description Utility functions to sanitize and validate input strings.
 */

// Strips leading zeros from numeric strings. Example:
// removeLeadingZero("0045"); // "45"
// removeLeadingZero("0000"); // "0"
// removeLeadingZero("abc");  // "abc"
export const removeLeadingZero = (value: string): string => {
  if (!value || typeof value !== "string") {
    return "";
  }

  if (!/^\d+$/.test(value)) {
    return value;
  }

  return value.replace(/^0+(?!$)/, "");
};

// Check if a string is a valid URL. Example:
// isValidUrl("https://admin.alphadrafts.com"); // true
// isValidUrl("invalid-url"); // false
export const isValidUrl = (url: string): boolean => {
  try {
    new URL(url);
    return true;
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
  } catch (_) {
    return false;
  }
};
