import ProjectContent from "@/components/project";
import { adminRoutes } from "@/constants";
import { AdminLayout } from "@/layouts";
import site from "@/site.metadata";
import { CustomHead } from "@/utils";
import React from "react";

const Page = () => {
  return <ProjectContent />;
};

export default Page;
Page.getLayout = function PageLayout(page: React.ReactNode) {
  const breadcrumbs = [
    { name: "Overview", href: adminRoutes?.overview },
    { name: "Projects", href: adminRoutes?.projects },
  ];

  return (
    <AdminLayout breadcrumbs={breadcrumbs} title="Project Management">
      <CustomHead title={site?.title + " Projects"} />
      {page}
    </AdminLayout>
  );
};
