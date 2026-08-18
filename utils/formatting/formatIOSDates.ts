/**
 * Utility functions for formatting and manipulating ISO date strings and time values.
 * Provides helpers to convert dates to readable strings, 12-hour time, and relative time descriptions.
 */

// Returns the current year as a number (e.g., 2023)
export const currentYear = new Date().getFullYear();

// Converts an ISO date string to a formatted date (e.g., "21st Aug, 2023")
export function formatIOSToDate(date: string): string {
  if (typeof date !== "string") return "";

  const dateString = date;
  const newDate = new Date(dateString);

  const formattedDate = `${newDate?.toLocaleString("en-US", {
    month: "short",
  })} ${newDate?.getDate()}, ${newDate?.getFullYear()}`;

  return formattedDate;
}

// Converts an ISO date string to a formatted date and time (e.g., "21st Aug, 2023, 09:00 AM")
export function formatIOSToDateAndTime(date: string): string {
  if (typeof date !== "string") return "";

  const dateString = date;
  const newDate = new Date(dateString);

  const formattedDate = `${newDate?.toLocaleString("en-US", {
    month: "short",
  })} ${newDate?.getDate()}, ${newDate?.getFullYear()}, ${newDate?.toLocaleString(
    "en-US",
    {
      hour: "numeric",
      minute: "numeric",
      hour12: true,
    },
  )}`;

  return formattedDate;
}

// Converts an ISO date string to a relative time description (e.g., "2 hours ago", "a week ago")
export const formatIOSToRelativeTime = (date: string): string => {
  if (typeof date !== "string") return "";

  const newDate = new Date(date);
  const now = new Date();

  const seconds = Math.floor((now.getTime() - newDate.getTime()) / 1000);
  const minutes = Math.floor(seconds / 60);
  const hours = Math.floor(minutes / 60);
  const days = Math.floor(hours / 24);
  const weeks = Math.floor(days / 7);
  const months = Math.floor(days / 30);
  const years = Math.floor(days / 365);

  if (seconds < 60) {
    return `${seconds} seconds ago`;
  } else if (minutes < 60) {
    return `${minutes} minutes ago`;
  } else if (hours < 24) {
    return `${hours} hours ago`;
  } else if (days < 7) {
    return `${days} days ago`;
  } else if (weeks < 4) {
    return `${weeks} weeks ago`;
  } else if (months < 12) {
    return `${months} months ago`;
  } else {
    return `${years} years ago`;
  }
};

// Converts a "HH:MM" string to 12-hour time format with AM/PM (e.g., "14:30" -> "2:30 PM")
export const formatTimeToString = (time: string): string => {
  if (typeof time !== "string") return "";

  const [hour, minute] = time.split(":").map(Number);

  const period = hour >= 12 ? "PM" : "AM";

  const formattedHour = hour % 12 || 12;

  return `${formattedHour}:${minute.toString().padStart(2, "0")} ${period}`;
};

// Converts an ISO date string to a relative time description with year (e.g., "2 years ago")
export const formatDateToRelativeTimeYearWithTime = (date: string): string => {
  if (typeof date !== "string") return "";

  const newDate = new Date(date);
  const now = new Date();

  const seconds = Math.floor((now.getTime() - newDate.getTime()) / 1000);
  const minutes = Math.floor(seconds / 60);
  const hours = Math.floor(minutes / 60);
  const days = Math.floor(hours / 24);
  const years = Math.floor(days / 365);

  return `${years}`;
};

// Function to check if a project due date has passed and format date
export const isDateOverdue = (dueDate: string, status: string) => {
  if (!dueDate) return false; // No due date set

  const date = new Date(dueDate);
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const isOverdue = date < today && status !== "completed";

  return isOverdue;
};

// Function to format project due date string
// Accepts string, plain {_seconds} object, or object with toDate()
export const formatUnderscoreDateToDate = (
  dueDate:
    | string
    | { _seconds: number; _nanoseconds?: number }
    | { toDate: () => Date }
    | undefined,
) => {
  if (!dueDate) return "";
  if (typeof dueDate === "string") return formatIOSToDate(dueDate);
  // Firestore Timestamp object
  if (
    typeof dueDate === "object" &&
    "_seconds" in dueDate &&
    typeof (dueDate as { _seconds: number })._seconds === "number"
  ) {
    return formatIOSToDate(
      new Date((dueDate as { _seconds: number })._seconds * 1000).toISOString(),
    );
  }
  // Object with toDate method
  if (
    typeof dueDate === "object" &&
    typeof (dueDate as { toDate: () => Date }).toDate === "function"
  ) {
    return formatIOSToDate(
      (dueDate as { toDate: () => Date }).toDate().toISOString(),
    );
  }
  return "";
};

export const formatUnderscoreDateToDateAndTime = (
  dueDate:
    | string
    | { _seconds: number; _nanoseconds?: number }
    | { toDate: () => Date }
    | undefined,
) => {
  if (!dueDate) return "";
  if (typeof dueDate === "string") return formatIOSToDateAndTime(dueDate);
  // Firestore Timestamp object
  if (
    typeof dueDate === "object" &&
    "_seconds" in dueDate &&
    typeof (dueDate as { _seconds: number })._seconds === "number"
  ) {
    return formatIOSToDateAndTime(
      new Date((dueDate as { _seconds: number })._seconds * 1000).toISOString(),
    );
  }
  // Object with toDate method
  if (
    typeof dueDate === "object" &&
    typeof (dueDate as { toDate: () => Date }).toDate === "function"
  ) {
    return formatIOSToDateAndTime(
      (dueDate as { toDate: () => Date }).toDate().toISOString(),
    );
  }
  return "";
};
