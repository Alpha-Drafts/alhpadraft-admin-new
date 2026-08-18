// This file provides a React context and provider for user roles, claims, and
// session state under the cookie-based JWT auth flow.
//
// The httpOnly session cookies mean the browser cannot read the JWT claims.
// Roles are sourced from `GET /v1/users/me` (the backend returns `roles`),
// which the AuthProvider fetches to establish the session. This provider
// derives claims from that session and keeps the old context interface
// (`customClaims`, `token`, `refreshToken`, `refreshClaims`) so consumers
// (route guards, dashboard role sync, React Query gates) keep working.

import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  ReactNode,
} from "react";
import { useAuth } from "./AuthProvider";
import { useDashboard } from "./DashboardContext";
import { UserRoleType } from "@/types";

export interface ClaimsProps {
  roles?: string[];
  email?: string;
  email_verified?: boolean;
  [key: string]: unknown;
}

interface ClaimsContextProps {
  customClaims: ClaimsProps | null;
  loading: boolean;
  /** Non-null while a valid session exists (used as an auth gate). */
  token: string | null;
  refreshToken: () => Promise<string | null>;
  refreshClaims: () => Promise<ClaimsProps | null>;
}

const ClaimsContext = createContext<ClaimsContextProps | undefined>(undefined);

export function ClaimsProvider({ children }: { children: ReactNode }) {
  const { user, loading: sessionLoading, refreshSession } = useAuth();
  const { setUserRoles, setIsAdmin, setIsSuperAdmin } = useDashboard();
  const [claims, setClaims] = useState<ClaimsProps | null>(null);

  const syncRoles = useCallback(
    (roles: string[] | undefined) => {
      const safeRoles = Array.isArray(roles) ? roles : [];
      setUserRoles(safeRoles as UserRoleType[]);
      const includes = (role: string) => safeRoles.includes(role);
      setIsAdmin(includes("admin"));
      setIsSuperAdmin(includes("super_admin"));
    },
    [setUserRoles, setIsAdmin, setIsSuperAdmin],
  );

  // Derive claims from the session user whenever it changes
  useEffect(() => {
    if (user) {
      const nextClaims: ClaimsProps = {
        roles: Array.isArray(user.roles) ? user.roles : ["user"],
        email: user.email,
        email_verified: Boolean(user.emailVerified),
      };
      setClaims(nextClaims);
      syncRoles(nextClaims.roles);
    } else {
      setClaims(null);
      syncRoles([]);
    }
  }, [user, syncRoles]);

  // Explicit refresh (used after login/logout)
  const refreshClaims = useCallback(async (): Promise<ClaimsProps | null> => {
    const next = await refreshSession();
    if (next) {
      const nextClaims: ClaimsProps = {
        roles: Array.isArray(next.roles) ? next.roles : ["user"],
        email: next.email,
        email_verified: Boolean(next.emailVerified),
      };
      setClaims(nextClaims);
      syncRoles(nextClaims.roles);
      return nextClaims;
    }
    return null;
  }, [refreshSession, syncRoles]);

  const refreshToken = useCallback(async (): Promise<string | null> => {
    const next = await refreshSession();
    return next ? "session" : null;
  }, [refreshSession]);

  const token = useMemo(() => (user ? "session" : null), [user]);

  const value = useMemo(
    () => ({
      customClaims: claims,
      loading: sessionLoading,
      token,
      refreshToken,
      refreshClaims,
    }),
    [claims, sessionLoading, token, refreshToken, refreshClaims],
  );

  return (
    <ClaimsContext.Provider value={value}>{children}</ClaimsContext.Provider>
  );
}

// Custom hook to access claims context
export function useClaims(): ClaimsContextProps {
  const context = useContext(ClaimsContext);
  if (context === undefined) {
    throw new Error("useClaims must be used within a ClaimsProvider");
  }
  return context;
}
