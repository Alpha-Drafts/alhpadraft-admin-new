import SettingsContent from "@/components/settings/Account";
import { adminRoutes } from "@/constants";
import { AdminLayout } from "@/layouts";
import site from "@/site.metadata";
import { CustomHead } from "@/utils";
import React from "react";

const Page = () => {
  return <SettingsContent />;
};

export default Page;
Page.getLayout = function PageLayout(page: React.ReactNode) {
  const breadcrumbs = [
    { name: "Overview", href: adminRoutes?.overview },
    { name: "Settings", href: adminRoutes?.settings },
  ];

  return (
    <AdminLayout breadcrumbs={breadcrumbs} title="Settings Management">
      <CustomHead title={site?.title + " Settings"} />
      {page}
    </AdminLayout>
  );
};
