import React from "react";
import SubscriptionTable from "./SubscriptionTable";

const SubscriptionContent = () => {
  return (
    <div className="w-full">
      <h1 className="mb-4 text-2xl font-medium">Subscription Management</h1>
      <SubscriptionTable />
    </div>
  );
};

export default SubscriptionContent;
