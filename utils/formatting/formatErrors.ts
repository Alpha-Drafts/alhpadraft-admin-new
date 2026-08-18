/**
 * Utility functions for formatting and normalizing error objects from various
 * sources (Axios, generic JS errors) into user-friendly error messages.
 */

/* eslint-disable @typescript-eslint/no-explicit-any */
import axios from "axios";

// Formats an error object into a user-friendly message.
export const formatError = (err: any, fallback?: string) => {
  let error = "";

  if (axios.isAxiosError(err)) {
    error = err.response?.data?.message;
  } else if (err instanceof Error) {
    error = err?.message;
  } else if (typeof err === "string") {
    error = err;
  } else {
    error = fallback || "An unknown error occurred";
  }

  return error;
};

// Used only for auth errors
export const formatAuthError = formatError;
