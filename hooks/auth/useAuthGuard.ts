/**
 * This custom React hook is used to protect routes by checking user authentication and roles.
 * It handles redirection for unauthenticated users and role-specific access, and updates dashboard context state.
 */

import { useEffect, useState } from "react";
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
    setActiveDashboard,
  } = useDashboard();
  const [isAuthorised, setIsAuthorised] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // If auth is still loading, wait
    if (authLoading) return;

    // If user is not authenticated, redirect to login
    if (!user) {
      if (!router.pathname.startsWith("/auth/")) {
        router.push(
          `${authRoutes?.login}?redirect=${encodeURIComponent(router.asPath)}`,
        );
      }
      setIsLoading(false);
      return;
    }

    // If claims are still loading, allow access temporarily
    if (claimsLoading) {
      setIsAuthorised(true);
      setIsLoading(false);
      return;
    }

    // Once claims are loaded, perform role check
    const userRoles = (customClaims?.roles || []) as UserRoleType[];

    // Only update userRoles if they've changed
    if (!isEqual(userRoles, currentUserRoles)) {
      setUserRoles(userRoles);
    }

    // If requiredRoles is set, check if user has at least one of them
    if (requiredRoles) {
      const required = Array.isArray(requiredRoles)
        ? requiredRoles
        : [requiredRoles];
      const hasRole = required.some(role =>
        userRoles.includes(role as UserRoleType),
      );
      if (!hasRole) {
        router.push(redirectOnDenied);
        setIsAuthorised(false);
        setIsLoading(false);
        return;
      }
    }

    setIsAuthorised(true);
    setIsLoading(false);
  }, [
    authLoading,
    claimsLoading,
    user,
    customClaims,
    router.pathname,
    router.asPath,
    requiredRoles,
    redirectOnDenied,
    router,
    setUserRoles,
    setActiveDashboard,
    currentUserRoles,
  ]);

  return { isAuthorised, isLoading };
};
