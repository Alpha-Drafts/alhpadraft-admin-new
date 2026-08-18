import React, { ReactNode } from "react";
import { ClaimsProvider } from "./ClaimsContext";
import { DashboardProvider } from "./DashboardContext";
import ReactQueryProvider from "./ReactQueryProvider";
import AuthProvider from "./AuthProvider";

export const AppProviders = ({ children }: { children: ReactNode }) => {
  return (
    <ReactQueryProvider>
      <AuthProvider>
        <DashboardProvider>
          <ClaimsProvider>{children}</ClaimsProvider>
        </DashboardProvider>
      </AuthProvider>
    </ReactQueryProvider>
  );
};
