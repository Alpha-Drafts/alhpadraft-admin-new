// This file provides a React context and provider for managing dashboard state and user roles.
// It enables switching between dashboards based on user roles and keeps track of the active dashboard.

import {
  createContext,
  useContext,
  useState,
  ReactNode,
  useCallback,
} from "react";
import { useRouter } from "next/router";
import { UserRoleType } from "@/types";
import { DEFAULT_ROUTE_PATH_ON_LOGIN } from "@/constants";

// Define the context value type for dashboard and user roles management
interface DashboardContextProps {
  activeDashboard: UserRoleType | null;
  setActiveDashboard: (dashboard: UserRoleType) => void;
  userRoles: UserRoleType[];
  setUserRoles: (roles: UserRoleType[]) => void;
  isAdmin: boolean;
  setIsAdmin: (value: boolean) => void;
  isSuperAdmin: boolean;
  setIsSuperAdmin: (value: boolean) => void;
}

const DashboardContext = createContext<DashboardContextProps | undefined>(
  undefined,
);

// Provider component to manage and supply dashboard state and user roles to the app
export function DashboardProvider({ children }: { children: ReactNode }) {
  const router = useRouter();
  const [activeDashboard, setActiveDashboardState] =
    useState<UserRoleType | null>(null);
  const [userRoles, setUserRoles] = useState<UserRoleType[]>([]);
  const [isAdmin, setIsAdmin] = useState(false);
  const [isSuperAdmin, setIsSuperAdmin] = useState(false);

  // Function to switch dashboards, only if the user has the required role
  // Also updates the active dashboard state and navigates to the correct route
  const handleDashboardSwitch = useCallback(
    (dashboard: UserRoleType) => {
      if (!userRoles.includes(dashboard)) return; // Prevent switching to unauthorised dashboards
      setActiveDashboardState(dashboard);

      router.push(DEFAULT_ROUTE_PATH_ON_LOGIN[dashboard]);
    },
    [router, userRoles],
  );

  return (
    <DashboardContext.Provider
      value={{
        activeDashboard,
        setActiveDashboard: handleDashboardSwitch,
        userRoles,
        setUserRoles,
        isAdmin,
        isSuperAdmin,
        setIsAdmin,
        setIsSuperAdmin,
      }}
    >
      {children}
    </DashboardContext.Provider>
  );
}

// Custom hook to access dashboard context
export function useDashboard() {
  const context = useContext(DashboardContext);
  if (context === undefined) {
    throw new Error("useDashboard must be used within a DashboardProvider");
  }
  return context;
}
