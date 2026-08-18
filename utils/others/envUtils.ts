/**
 * @description
 * This file defines the environment types and the corresponding URLs for each environment (local, development, staging, production).
 *
 * @example
 * const envUrl = getEnvUrl();
 * alert(envUrl);  // Output: https://admin.alphadrafts.com (depending on environment)
 *
 * So if the environment is set to "development", and the `NEXT_PUBLIC_DEVELOPMENT_URL` is "https://dev.alphadrafts.com", it will alert "https://dev.alphadrafts.com".
 *
 * Useful for dynamically setting API endpoints or other environment-specific configurations in a Next.js application.
 *
 * This utility function helps in managing different environments without hardcoding URLs in the application.
 */

import { ENVIRONMENT_TYPES } from "@/constants";

export type CustomNodeEnv = (typeof ENVIRONMENT_TYPES)[number];

// This object maps the custom environment types to their respective URLs.
const envUrls: { [key in CustomNodeEnv]: string } = {
  local: process.env.NEXT_PUBLIC_LOCAL_URL || "",
  development: process.env.NEXT_PUBLIC_DEVELOPMENT_URL || "",
  staging: process.env.NEXT_PUBLIC_STAGING_URL || "",
  production: process.env.NEXT_PUBLIC_PRODUCTION_URL || "",
};

// This function retrieves the current environment from the environment variables.
export const getEnv = (): CustomNodeEnv => {
  return process.env.NEXT_PUBLIC_NODE_ENV as CustomNodeEnv;
};

// This function returns the URL corresponding to the current environment.
export const getEnvUrl = (): string => {
  const env = getEnv();
  return envUrls[env];
};
