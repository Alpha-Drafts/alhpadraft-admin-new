import React from "react";
import { Tab } from "@/common";
import AdminTable from "./AdminTable";
import { useFetchHook } from "@/hooks";
import { AdminCountProps } from "@/types";
import { useClaims, useDashboard } from "@/context";

const AdminsSwitcher = () => {
  const { token } = useClaims();
  const { isSuperAdmin } = useDashboard();

  const STYLES = {
    wrapper: "text-body-semibold-1",
    text: "ml-1 inline-flex aspect-square w-8 items-center justify-center rounded-full bg-primary-500 text-white",
  };

  const { data: adminCount, refetch: refetchCount } =
    useFetchHook<AdminCountProps>({
      endpoint: `/api/v1/admins/admins-count`,
      enabled: !!token,
    });

  return (
    <Tab
      tabs={[
        {
          key: "admins",
          title: (
            <p className={STYLES.wrapper}>
              Admins{" "}
              <span className={STYLES.text}>
                {(adminCount?.admins_count ?? 0) > 99
                  ? "99+"
                  : (adminCount?.admins_count ?? 0)}
              </span>
            </p>
          ),
          content: (
            <AdminTable
              type="admin"
              isSuperAdmin={isSuperAdmin}
              refetchCount={refetchCount}
            />
          ),
        },
        {
          key: "super_admins",
          title: (
            <p className={STYLES.wrapper}>
              Super Admins{" "}
              <span className={STYLES.text}>
                {(adminCount?.super_admins_count ?? 0) > 99
                  ? "99+"
                  : (adminCount?.super_admins_count ?? 0)}
              </span>
            </p>
          ),
          content: (
            <AdminTable
              type="super_admin"
              isSuperAdmin={isSuperAdmin}
              refetchCount={refetchCount}
            />
          ),
        },
      ]}
      queryParam="type"
    />
  );
};

export default AdminsSwitcher;
