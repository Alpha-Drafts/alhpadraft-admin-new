/**
 * @description
 * This file defines route constants for various sections of the website, making it easier to manage and reference URLs throughout the application.
 * Example: `publicRoutes` groups all public routes related to the main website, while `authRoutes` contains routes for authentication-related pages.
 * This structure helps in maintaining a clean and organized codebase, especially in larger applications where routes can become complex.
 */

export const publicRoutes: Record<string, string> = {
  home: "/",
  unauthorised: "/unauthorised",
};

export const authRoutes: Record<string, string> = {
  auth: "/auth",
  login: "/auth/login",
  forgot_password: "/auth/forgot-password",
  reset_password: "/auth/reset-password",
};

export const adminRoutes: Record<string, string> = {
  overview: "/admin/overview",
  users: "/admin/users",
  admins: "/admin/admins",
  projects: "/admin/projects",
  profile: "/admin/profile",
  subscriptions: "/admin/subscriptions",
  transactions: "/admin/transactions",
  settings: "/admin/settings",
};
