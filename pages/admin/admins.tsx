import AdminsContent from "@/components/admins";
import { AdminLayout } from "@/layouts";
import { ADMINS_ENABLED, adminRoutes } from "@/constants";
import { useRouter } from "next/router";
import React, { JSXElementConstructor, ReactElement, useEffect } from "react";

const Page = () => {
  const router = useRouter();

  useEffect(() => {
    if (!ADMINS_ENABLED) router.replace(adminRoutes?.overview);
  }, [router]);

  if (!ADMINS_ENABLED) return null;

  return <AdminsContent />;
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
    { name: "Admins", href: adminRoutes?.admins },
  ];

  return (
    <AdminLayout breadcrumbs={breadcrumbs} title="Admins Management">
      {children}
    </AdminLayout>
  );
};
