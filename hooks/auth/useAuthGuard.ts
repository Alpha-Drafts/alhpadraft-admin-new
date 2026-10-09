/**
 * This custom React hook is used to protect routes by checking user authentication and roles.
 * It handles redirection for unauthenticated users and role-specific access, and updates dashboard context state.
 */

import { useEffect, useMemo } from "react";
import { useRouter } from "next/router";
import { useAuth } from "@/context/AuthProvider";
import { useClaims } from "@/context/ClaimsContext";
import { useDashboard } from "@/context/DashboardContext";
import { authRoutes, publicRoutes } from "@/constants";
import { isEqual } from "lodash";
import { UserRoleType } from "@/types";

export const useAuthGuard = (
  requiredRoles?: UserRoleType | UserRoleType[],
  redirectOnDenied: string = publicRoutes?.unauthorised || "/unauthorised",
) => {
  const router = useRouter();
  const { user, loading: authLoading } = useAuth();
  const { customClaims, loading: claimsLoading } = useClaims();
  const {
    userRoles: currentUserRoles,
    setUserRoles,
  } = useDashboard();

  const userRoles = useMemo(
    () => (customClaims?.roles || []) as UserRoleType[],
    [customClaims?.roles],
  );
  const required = requiredRoles
    ? Array.isArray(requiredRoles)
      ? requiredRoles
      : [requiredRoles]
    : null;
  const hasRole =
    !required ||
    required.some(role => userRoles.includes(role as UserRoleType));

  const isLoading = authLoading || (Boolean(user) && claimsLoading);
  const isAuthorised = Boolean(user) && !claimsLoading && hasRole;

  useEffect(() => {
    if (isLoading) return;

    if (!user) {
      if (!router.pathname.startsWith("/auth/")) {
        router.push(
          `${authRoutes?.login}?redirect=${encodeURIComponent(router.asPath)}`,
        );
      }
      return;
    }

    if (!isEqual(userRoles, currentUserRoles)) {
      setUserRoles(userRoles);
    }

    if (!hasRole) {
      router.push(redirectOnDenied);
    }
  }, [
    isLoading,
    user,
    userRoles,
    currentUserRoles,
    setUserRoles,
    hasRole,
    router,
    redirectOnDenied,
  ]);

  return { isAuthorised, isLoading };
};
