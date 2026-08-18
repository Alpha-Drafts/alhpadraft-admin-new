/**
 * This file configures a custom Axios API client for making HTTP requests.
 *
 * - Session is carried by httpOnly cookies set by the backend, so requests
 *   must send credentials (`withCredentials: true`).
 * - No Authorization header is attached anymore — the backend reads the
 *   `access_token` cookie only.
 * - The `X-CSRF-Token` header is echoed from the non-httpOnly `csrf_token`
 *   cookie on unsafe methods (the backend CsrfGuard enforces it on /auth/*).
 * - On 401 the client attempts one silent refresh via POST /v1/auth/refresh
 *   (which rotates the cookies) and retries the original request once.
 */

import axios, {
  AxiosError,
  AxiosResponse,
  InternalAxiosRequestConfig,
} from "axios";
import { API_BASE_URL } from "@/constants";
import { getCsrfToken } from "@/utils/auth/csrf";
import { toast } from "react-toastify";

// Create axios instance for API requests
const apiClient = axios.create({
  baseURL: "/",
  headers: {
    "Content-Type": "application/json",
  },
  withCredentials: true,
});

const UNSAFE_METHODS = new Set(["POST", "PUT", "PATCH", "DELETE"]);

// Store pending refresh promise to avoid duplicate refreshes
const pendingRefreshPromise: { promise?: Promise<boolean> } = {};

/**
 * Calls the backend refresh endpoint to rotate the session cookies.
 * Returns true if the access cookie was refreshed successfully.
 */
const refreshSession = async (): Promise<boolean> => {
  if (!pendingRefreshPromise.promise) {
    pendingRefreshPromise.promise = apiClient
      .post(`${API_BASE_URL}/v1/auth/refresh`)
      .then(() => true)
      .catch(() => false)
      .finally(() => {
        pendingRefreshPromise.promise = undefined;
      });
  }
  return pendingRefreshPromise.promise;
};

// Request interceptor: echo CSRF token on state-changing requests.
// The session itself is carried by cookies — no token logic here.
apiClient.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    if (UNSAFE_METHODS.has((config.method ?? "get").toUpperCase())) {
      const csrf = getCsrfToken();
      if (csrf && !config.headers["X-CSRF-Token"]) {
        config.headers["X-CSRF-Token"] = csrf;
      }
    }
    return config;
  },
  error => Promise.reject(error),
);

// Response interceptor: handle session expiry with a single silent refresh,
// then delegate to the friendly error formatter.
apiClient.interceptors.response.use(
  (response: AxiosResponse) => response,
  async (error: AxiosError) => {
    const originalRequest = error?.config as
      | (InternalAxiosRequestConfig & { _retry?: boolean })
      | undefined;

    console.error("API request failed:", {
      method: originalRequest?.method?.toUpperCase(),
      url: `${originalRequest?.baseURL ?? ""}${originalRequest?.url ?? ""}`,
      status: error?.response?.status,
    });

    // Session expired: refresh once and retry the original request
    if (
      error?.response?.status === 401 &&
      originalRequest &&
      !originalRequest._retry &&
      !originalRequest.url?.includes("/v1/auth/")
    ) {
      originalRequest._retry = true;

      const refreshed = await refreshSession();
      if (refreshed) {
        return apiClient(originalRequest);
      }

      // Refresh failed → session is gone. Route guards (useAuthGuard) and the
      // AuthProvider handle redirecting protected pages; no hard redirect here
      // so public pages stay usable.
      return Promise.reject(error);
    }

    // Check if response is HTML
    if (error?.response) {
      const contentType = error?.response?.headers["content-type"] || "";
      if (contentType.includes("text/html")) {
        const statusCode = error?.response?.status;
        let errorMessage = "An unexpected error occurred";

        if (statusCode === 404) {
          errorMessage = "The requested resource was not found";
        } else if (statusCode >= 500) {
          errorMessage = "A server error occurred. Please try again later.";
        }

        // Show toast notification
        toast.error(errorMessage);

        // Create a custom error with proper serialization
        const enhancedError: Error & { statusCode?: number } = new Error(
          errorMessage,
        );
        enhancedError.name = "HttpError";
        enhancedError.statusCode = statusCode;

        // Ensure the error is properly serialized
        if (Error.captureStackTrace) {
          Error.captureStackTrace(
            enhancedError,
            apiClient.interceptors.response?.use,
          );
        }

        return Promise.reject({
          message: errorMessage,
          name: "HttpError",
          statusCode,
          isAxiosError: true,
        });
      }
    }

    // For JSON error responses, extract the backend message
    if (
      error?.response?.headers?.["content-type"]?.includes(
        "application/json",
      ) &&
      error?.response?.data &&
      typeof error?.response?.data === "object"
    ) {
      const errorMessage =
        (error?.response?.data as { message?: string })?.message ||
        (error?.response?.data as { error?: { code?: string } })?.error?.code ||
        "An error occurred.";

      const formattedError = {
        message: errorMessage,
        name: "ApiError",
        statusCode: error?.response?.status,
        isAxiosError: true,
      };

      return Promise.reject(formattedError);
    }
    if (error?.code === "ECONNABORTED" || !error?.response) {
      const networkError = {
        message: "Network error. Please check your connection and try again.",
        name: "NetworkError",
        statusCode: 0,
        isAxiosError: true,
      };
      toast.error(networkError.message);
      return Promise.reject(networkError);
    }

    // Final fallback
    console.error("Unhandled Axios error:", {
      message: error.message,
      code: error.code,
      status: error?.response?.status,
      headers: error?.response?.headers,
      data: error?.response?.data,
    });

    // For other errors, just reject the promise
    return Promise.reject(error);
  },
);

export default apiClient;
