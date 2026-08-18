import site from "@/site.metadata";
import { CustomHead } from "@/utils";
import React, { ReactNode } from "react";

const PublicLayout = ({ children }: { children: ReactNode }) => {
  return (
    <>
      <CustomHead title={site.title} />
      <div className="grid gap-y-6 bg-white lg:gap-y-10">{children}</div>
    </>
  );
};

export default PublicLayout;
