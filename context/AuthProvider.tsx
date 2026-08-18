// This file provides a React context and provider for the cookie-based auth
// session (backend cookie-JWT migration).
//
// The session is carried by httpOnly cookies set by the backend, so the
// browser-side state is derived from `GET /v1/users/me`:
//   - 200 → signed in (user payload)
//   - 401 → not signed in

import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
} from "react";
import { apiClient } from "@/utils/api";
import { API_BASE_URL } from "@/constants";

export interface SessionUser {
  uid: string;
  email: string;
  fullName: string;
  roles?: string[];
  emailVerified?: boolean;
}

type AuthContextType = {
  user: SessionUser | null;
  loading: boolean;
  /** Re-checks the session against the backend (call after login/logout). */
  refreshSession: () => Promise<SessionUser | null>;
};

const AuthContext = createContext<AuthContextType>({
  user: null,
  loading: true,
  refreshSession: async () => null,
});

const mapMeResponse = (data: unknown): SessionUser | null => {
  if (!data || typeof data !== "object") return null;
  const me = data as Record<string, unknown>;
  const uid = (me.id as string) || (me.uid as string) || "";
  if (!uid) return null;
  return {
    uid,
    email: (me.email as string) ?? "",
    fullName: (me.fullName as string) ?? (me.name as string) ?? "",
    roles: Array.isArray(me.roles) ? (me.roles as string[]) : undefined,
    emailVerified: Boolean(me.emailVerified),
  };
};

// Custom hook to use the auth context
export const useAuth = () => useContext(AuthContext);

// Auth Provider component to wrap the app and provide user/auth state
export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<SessionUser | null>(null);
  const [loading, setLoading] = useState(true);

  const refreshSession = useCallback(async (): Promise<SessionUser | null> => {
    try {
      const res = await apiClient.get<{
        status: string;
        data: unknown;
      }>(`${API_BASE_URL}/v1/users/me`);
      const next = mapMeResponse(res.data?.data);
      setUser(next);
      return next;
    } catch {
      setUser(null);
      return null;
    }
  }, []);

  useEffect(() => {
    let active = true;

    (async () => {
      const next = await refreshSession();
      if (active) {
        setUser(next);
        setLoading(false);
      }
    })();

    return () => {
      active = false;
    };
  }, [refreshSession]);

  return (
    <AuthContext.Provider value={{ user, loading, refreshSession }}>
      {children}
    </AuthContext.Provider>
  );
}

export default AuthProvider;
