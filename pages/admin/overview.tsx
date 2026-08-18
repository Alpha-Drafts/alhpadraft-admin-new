import OverviewContent from "@/components/overview";
import { adminRoutes } from "@/constants";
import { AdminLayout } from "@/layouts";
import site from "@/site.metadata";
import { CustomHead } from "@/utils";
import React from "react";

const Page = () => {
  return <OverviewContent />;
};

export default Page;
Page.getLayout = function PageLayout(page: React.ReactNode) {
  const breadcrumbs = [{ name: "Overview", href: adminRoutes?.overview }];

  return (
    <AdminLayout breadcrumbs={breadcrumbs} title="Admins Management">
      <CustomHead title={site?.title + " Overview"} />
      {page}
    </AdminLayout>
  );
};
