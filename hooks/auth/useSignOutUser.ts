// This file provides a custom React hook for signing out the current user from
// the backend session (cookie-based JWT auth). It handles sign-out logic and
// displays an error toast if sign-out fails.

import { logoutUser } from "@/utils/auth";
import { formatAuthError } from "../../utils/formatting";
import { toast } from "react-toastify";
import { useRouter } from "next/router";
import { useQueryClient } from "@tanstack/react-query";

// Custom React hook to sign out the current user from the backend session.
export const useSignOutUser = () => {
  const router = useRouter();
  const queryClient = useQueryClient();
  // Signs out the current user and handles errors.
  const signOutUser = async () => {
    try {
      await logoutUser();
      queryClient.clear(); // Clear all React Query cache
      router.push("/auth/login"); // Redirects to the login page after sign-out.
    } catch (error) {
      // Show error toast if sign-out fails.
      toast.error(formatAuthError(error, "Failed to sign out user"));
    }
  };

  // Returns the signOutUser function.
  return { signOutUser };
};
