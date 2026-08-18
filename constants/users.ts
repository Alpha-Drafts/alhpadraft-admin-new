import { UserRoleType } from "@/types";
import { adminRoutes, publicRoutes } from "./routes";

export const USER_ROLES = ["user", "admin", "super_admin"] as const;

export const USER_STATUSES = ["active", "disabled", "banned"] as const;

// Default route paths for each user role
export const DEFAULT_ROUTE_PATH_ON_LOGIN: Record<UserRoleType, string> = {
  user: publicRoutes.unauthorised,
  admin: adminRoutes.overview,
  super_admin: adminRoutes.overview,
};
