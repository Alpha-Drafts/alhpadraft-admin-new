// This file provides a React component that sets up and provides the React Query client to the app.
// It configures default query options for caching, garbage collection, and retry behavior.

import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import React, { useState } from "react";

export default function ReactQueryProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  // Create a single QueryClient instance for the app
  const [queryClient] = useState(
    () =>
      new QueryClient({
        defaultOptions: {
          queries: {
            staleTime: 1000 * 60 * 5, // 5 minutes
            gcTime: 1000 * 60 * 10, // 10 minutes before garbage collection
            refetchOnWindowFocus: true, // default: true
            retry: 1,
          },
        },
      }),
  );

  // Provide the QueryClient to all children components
  return (
    <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
  );
}
