import React from "react";
import UserTable from "./UserTable";

const UsersContent = () => {
  return (
    <div>
      <h1 className="mb-4 text-2xl font-medium">User Management</h1>

      <UserTable />
    </div>
  );
};

export default UsersContent;
