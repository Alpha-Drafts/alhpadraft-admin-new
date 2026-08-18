import { AdminRoleType } from "@/types";
import { adminRoutes } from "./routes";

export const ADMIN_ROLES = ["admin", "super_admin"] as const;

// Admins management feature flag. The Contabo backend exposes no
// admin-management endpoints (GAP), so the page is hidden until it has one.
export const ADMINS_ENABLED = false;

// Default route paths for each user role
export const DEFAULT_ADMIN_ROUTE_PATH_ON_LOGIN: Record<AdminRoleType, string> =
  {
    admin: adminRoutes?.overview,
    super_admin: adminRoutes?.overview,
  };
