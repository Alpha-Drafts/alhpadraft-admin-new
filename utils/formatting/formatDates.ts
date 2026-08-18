/**
 * Utility functions for formatting and manipulating timestamp objects.
 * Provides helpers to convert timestamps to readable date/time strings and perform date calculations.
 */

import { format } from "date-fns";

export type TimestampLike = {
  _seconds: number;
  _nanoseconds: number;
};

const toDate = (timestampObj: TimestampLike): Date =>
  new Date(
    timestampObj._seconds * 1000 + timestampObj._nanoseconds / 1_000_000,
  );

// Converts a timestamp to a formatted date string (e.g., "22nd Jun, 2023")
export const formatTimestampToDate = (timestampObj: TimestampLike): string => {
  if (!timestampObj) return "";

  return format(toDate(timestampObj), "do MMM',' yyyy");
};

// Converts a timestamp to a formatted time string (e.g., "12:12 AM")
export const formatTimestampToTime = (timestampObj: TimestampLike): string => {
  if (!timestampObj) return "";

  return format(toDate(timestampObj), "hh:mm a");
};

// Converts a timestamp to a formatted date and time string (e.g., "22nd Jun, 2023, 12:12 AM")
export const formatTimestampToDateAndTime = (
  timestampObj: TimestampLike,
): string => {
  if (!timestampObj) return "";

  return format(toDate(timestampObj), "do MMM',' yyyy, hh:mm a");
};

// Returns the number of years between the given timestamp and now as a string
export const formatTimestampToRelativeYear = (
  timestampObj: TimestampLike,
): string => {
  if (!timestampObj) return "";

  const newDate = toDate(timestampObj);
  const now = new Date();

  const secondsDiff = Math.floor((now.getTime() - newDate.getTime()) / 1000);
  const minutes = Math.floor(secondsDiff / 60);
  const hours = Math.floor(minutes / 60);
  const days = Math.floor(hours / 24);
  const years = Math.floor(days / 365);

  return `${years}`;
};

// Extracts and returns the year from a timestamp as a string
export const getYearFromTimestamp = (timestampObj: TimestampLike): string => {
  if (!timestampObj) return "";

  const newDate = toDate(timestampObj);
  const year = newDate.getFullYear();
  return year.toString();
};

// Checks if a timestamp is less than one month old from the current date
export function checkIfCreatedLessThanOneMonthAgo(createdAt: TimestampLike) {
  // Convert to JavaScript Date object
  const createdDate = toDate(createdAt);

  // Get current date
  const currentDate = new Date();

  // Calculate the date one month ago
  const oneMonthAgo = new Date();
  oneMonthAgo.setMonth(currentDate.getMonth() - 1);

  // Compare the created date with the date one month ago
  return createdDate > oneMonthAgo;
}

// Converts a timestamp to a relative time description (e.g., "2 hours ago", "a week ago")
export const formatTimestampToRelativeTime = (
  timestampObj: TimestampLike,
): string => {
  if (!timestampObj) return "";

  const newDate = toDate(timestampObj);

  const now = new Date();

  const sec = Math.floor((now.getTime() - newDate.getTime()) / 1000);
  const minutes = Math.floor(sec / 60);
  const hours = Math.floor(minutes / 60);
  const days = Math.floor(hours / 24);
  const weeks = Math.floor(days / 7);
  const months = Math.floor(days / 30);
  const years = Math.floor(days / 365);

  if (sec < 60) {
    return `${sec} seconds ago`;
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

export const formatTimestampToDateTwo = (
  timestamp: TimestampLike | Date | string,
): string => {
  let date: Date;

  if (
    typeof timestamp === "object" &&
    timestamp !== null &&
    "_seconds" in timestamp &&
    "_nanoseconds" in timestamp
  ) {
    date = toDate(timestamp);
  } else if (timestamp instanceof Date) {
    date = timestamp;
  } else if (typeof timestamp === "string") {
    date = new Date(timestamp);
  } else {
    return "Invalid Date";
  }

  // Format the date as needed. Example: "YYYY-MM-DD HH:MM AM/PM"
  // You can use libraries like 'date-fns' or 'moment' for more advanced formatting
  const options: Intl.DateTimeFormatOptions = {
    year: "numeric",
    month: "short",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
    hour12: true, // For AM/PM format
  };

  return date.toLocaleString("en-US", options);
};
