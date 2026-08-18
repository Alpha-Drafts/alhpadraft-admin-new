import React, { ReactNode } from "react";
import { LoadingState } from "@/common";
import { useAuthGuard } from "@/hooks";
import { CustomHead } from "@/utils";
import {
  MobileNavigation,
  NavBar,
  Sidebar,
} from "@/components/navigation/admin";
import { BreadcrumbProps } from "@/types";
import site from "@/site.metadata";
import { publicRoutes } from "@/constants";

const AdminLayout = ({
  children,
  breadcrumbs,
  title,
}: {
  children: ReactNode;
  breadcrumbs: BreadcrumbProps[];
  title: string;
}) => {
  const { isAuthorised, isLoading } = useAuthGuard(
    "admin",
    publicRoutes?.unauthorised,
  );

  if (isLoading) {
    return <LoadingState />;
  }

  if (!isAuthorised) {
    return null; // Return null while redirecting to login
  }

  return (
    <>
      <CustomHead title={site.title + " - " + title} />

      <div className="mx-auto min-h-svh bg-neutral-50">
        <NavBar />
        <MobileNavigation breadcrumbs={breadcrumbs} />
        <Sidebar />

        {/* This is the main content area */}
        <div className="w-full lg:ps-64">
          <div className="space-y-4 p-4 sm:space-y-6 sm:p-6">{children}</div>
        </div>
      </div>
    </>
  );
};

export default AdminLayout;
