/**
 * This file contains finance-related constants used throughout the application.
 */

export const ACCEPTED_CURRENCIES = ["NGN", "USD"] as const;

export const TRANSACTION_STATUSES = [
  "pending",
  "in_progress",
  "completed",
  "failed",
  "reversed",
] as const;
