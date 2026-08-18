/**
 * Backend auth API calls (cookie-based JWT session).
 *
 * Endpoints:
 *   POST /v1/auth/login   → sets session cookies
 *   POST /v1/auth/logout  → revokes refresh token + clears cookies
 *   GET  /v1/auth/csrf-token → sets the csrf_token cookie
 *
 * Mutations on /auth/* require the `X-CSRF-Token` header (CsrfGuard),
 * so the caller must `ensureCsrfToken()` first.
 */

import { apiClient } from "@/utils/api";
import { API_BASE_URL } from "@/constants";
import { ensureCsrfToken } from "./session";
import { getCsrfToken } from "./csrf";

export interface AuthSessionUser {
  uid: string;
  email: string;
  fullName: string;
}

export interface LoginParams {
  email: string;
  password: string;
}

const withCsrf = () => ({ "X-CSRF-Token": getCsrfToken() || "" });

export async function loginUser(params: LoginParams): Promise<AuthSessionUser> {
  await ensureCsrfToken();
  const res = await apiClient.post<{
    status: string;
    data: AuthSessionUser;
  }>(`${API_BASE_URL}/v1/auth/login`, params, {
    headers: withCsrf(),
  });
  return res.data.data;
}

export async function logoutUser(): Promise<void> {
  try {
    await ensureCsrfToken();
    await apiClient.post(
      `${API_BASE_URL}/v1/auth/logout`,
      {},
      {
        headers: withCsrf(),
      },
    );
  } catch (error) {
    // Always clear client state even if the server call fails
    console.error("Logout API call failed:", error);
  }
}
