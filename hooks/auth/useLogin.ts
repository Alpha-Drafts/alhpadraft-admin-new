// This file provides a custom React hook for handling user login via the
// backend JWT cookie session (`POST /v1/auth/login`).

import { useState } from "react";
import { useRouter } from "next/router";
import { formatError } from "@/utils";
import { loginUser } from "@/utils/auth";
import { adminRoutes } from "@/constants";
import { useClaims } from "@/context";

// Custom React hook to handle user login with the backend session API.
// Returns the login function, error message, and processing state.
export const useLogin = () => {
  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState<string>("");
  const router = useRouter();
  const { refreshClaims } = useClaims();

  // Attempts to sign in a user with email and password.
  // Redirects to the specified URL or dashboard on success.
  const login = async (
    email: string,
    password: string,
    redirectUrl?: string,
  ) => {
    setError("");
    setIsProcessing(true);

    try {
      const user = await loginUser({ email, password });

      if (user) {
        // Sync session/roles state before navigating (cookies are already set)
        try {
          await refreshClaims();
        } catch (refreshError) {
          console.error("Error refreshing session after login:", refreshError);
        }

        if (redirectUrl) {
          router.push(redirectUrl);
        } else {
          router.push(adminRoutes?.overview);
        }
      }
    } catch (loginError) {
      setError(
        formatError(loginError, "An error occurred while signing you in"),
      );
    } finally {
      setIsProcessing(false);
    }
  };

  // Return the login function, error message, and processing/loading state.
  return { login, isProcessing, error };
};
