import { AdminLayout } from "@/layouts";
import { adminRoutes } from "@/constants";
import React, { JSXElementConstructor, ReactElement } from "react";
import UsersContent from "@/components/users";

const Page = () => {
  return <UsersContent />;
};

export default Page;

Page.getLayout = function PageLayout(
  children: ReactElement<
    unknown,
    string | JSXElementConstructor<React.ReactNode>
  >,
) {
  const breadcrumbs = [
    { name: "Overview", href: adminRoutes?.overview },
    { name: "Users", href: adminRoutes?.users, current: true },
  ];

  return (
    <AdminLayout breadcrumbs={breadcrumbs} title="Users Management">
      {children}
    </AdminLayout>
  );
};
