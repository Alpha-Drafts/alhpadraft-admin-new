/**
 * Pure cookie helpers for the backend CSRF double-submit flow
 * (cookie `csrf_token`, header `X-CSRF-Token`). No dependencies on apiClient —
 * imported by both the auth session helpers and the apiClient interceptor.
 */

const CSRF_COOKIE = "csrf_token";

/** Reads the current csrf_token cookie value (null if not set). */
export const getCsrfToken = (): string | null => {
  if (typeof document === "undefined") return null;
  const match = document.cookie
    .split("; ")
    .find(row => row.startsWith(`${CSRF_COOKIE}=`));
  return match ? decodeURIComponent(match.split("=").slice(1).join("=")) : null;
};

/** Headers to attach to unsafe (state-changing) requests when a CSRF token is present. */
export const csrfHeaders = (): Record<string, string> => {
  const token = getCsrfToken();
  return token ? { "X-CSRF-Token": token } : {};
};
