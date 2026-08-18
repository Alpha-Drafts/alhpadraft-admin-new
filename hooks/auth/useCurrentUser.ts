// This file provides a custom React hook for accessing the current session user.
// The user is derived from `GET /v1/users/me` in the AuthProvider (cookie-based
// auth). It maps the session user onto the shape consumers expect
// (`displayName`, `photoURL`, `email`) so navigation/settings keep working.

import { useAuth } from "@/context/AuthProvider";

// Custom React hook to get the current session user.
// Returns the current user object or null if not authenticated.
export const useCurrentUser = () => {
  const { user } = useAuth();

  const currentUser = user
    ? {
        uid: user.uid,
        email: user.email,
        fullName: user.fullName,
        roles: user.roles,
        displayName: user.fullName,
        photoURL: "",
      }
    : null;

  // Return the current authenticated user or null.
  return { currentUser };
};
