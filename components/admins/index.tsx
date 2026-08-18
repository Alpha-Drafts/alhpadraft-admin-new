import React from "react";
import Switcher from "./Switcher";
import { useDashboard } from "@/context";
import AdminTable from "./AdminTable";

const AdminsContent = () => {
  const { isSuperAdmin } = useDashboard();

  return (
    <div>
      <h1 className="mb-4 text-2xl font-medium">Admin Management</h1>
      {isSuperAdmin ? (
        <Switcher />
      ) : (
        <AdminTable type="admin" isSuperAdmin={isSuperAdmin} />
      )}
    </div>
  );
};

export default AdminsContent;
