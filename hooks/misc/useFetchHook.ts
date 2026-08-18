// This file provides a custom React hook for fetching data from an API endpoint with Firebase authentication.
// It uses React Query for data fetching, caching, and error handling, and ensures the Firebase token is included in requests.

import { useQuery } from "@tanstack/react-query";
import { ApiResponseProps } from "@/types";
import { formatError } from "@/utils";
import { apiClient } from "@/utils/api";

// Custom hook to fetch data from an API endpoint with authentication.
// Accepts endpoint, params, enabled flag, and query options.
export function useFetchHook<T>({
  endpoint,
  params,
  enabled = true,
  ...options
}: {
  endpoint: string;
  params?: Record<string, string | number | boolean | null>;
  enabled?: boolean;
}) {
  return useQuery({
    queryKey: [endpoint, params], // Ensure query invalidates when endpoint or params change
    queryFn: async (): Promise<T> => {
      try {
        // The apiClient will automatically add the token and handle refresh if needed
        const response = await apiClient.get<ApiResponseProps<T>>(endpoint, {
          params,
        });

        // Check for error response
        if (response.data.status !== "success") {
          throw new Error(response.data.message || "Failed to fetch data");
        }

        // Ensure data exists
        if (!response.data.data) {
          throw new Error("No data found");
        }

        return response.data.data;
      } catch (error) {
        // Format and throw error if request fails
        throw new Error(formatError(error, "Failed to fetch data"));
      }
    },
    enabled,
    ...options,
  });
}
