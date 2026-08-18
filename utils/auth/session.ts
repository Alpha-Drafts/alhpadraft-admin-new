/**
 * Session helpers for the cookie-based (JWT) auth flow.
 *
 * The backend issues httpOnly `access_token` / `refresh_token` cookies which
 * the browser attaches automatically on same-site requests (`withCredentials`).
 * The frontend never reads the tokens; it only needs to:
 *   1. fetch the non-httpOnly `csrf_token` cookie before auth mutations
 *   2. echo it in the `X-CSRF-Token` header (double-submit CSRF defense)
 *   3. know whether a session exists (access cookie valid)
 */

import { apiClient } from "@/utils/api";
import { API_BASE_URL } from "@/constants";
import { getCsrfToken } from "./csrf";

/**
 * Guarantees a csrf_token cookie exists by calling GET /v1/auth/csrf-token
 * (which sets the cookie) when none is present. Call before login/logout.
 */
export const ensureCsrfToken = async (): Promise<string | null> => {
  const existing = getCsrfToken();
  if (existing) return existing;
  try {
    await apiClient.get(`${API_BASE_URL}/v1/auth/csrf-token`);
    return getCsrfToken();
  } catch (error) {
    console.error("Failed to fetch CSRF token:", error);
    return null;
  }
};
