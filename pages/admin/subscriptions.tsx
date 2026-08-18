import SubscriptionContent from "@/components/subscription";
import { adminRoutes } from "@/constants";
import { AdminLayout } from "@/layouts";
import site from "@/site.metadata";
import { CustomHead } from "@/utils";
import React from "react";

const Page = () => {
  return <SubscriptionContent />;
};

export default Page;
Page.getLayout = function PageLayout(page: React.ReactNode) {
  const breadcrumbs = [
    { name: "Overview", href: adminRoutes?.overview },
    { name: "Subscription", href: adminRoutes?.subscriptions },
  ];

  return (
    <AdminLayout breadcrumbs={breadcrumbs} title="Subscription Management">
      <CustomHead title={site?.title + " Subscription"} />
      {page}
    </AdminLayout>
  );
};
