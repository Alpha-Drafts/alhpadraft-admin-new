import React from "react";
import site from "@/site.metadata";
import { CustomHead } from "@/utils";
import FiveHundredPage from "@/components/others/FiveHundredPage";

export default function Page() {
  return <FiveHundredPage />;
}

Page.getLayout = function PageLayout(page: React.ReactNode) {
  return (
    <>
      <CustomHead
        title={site?.title + " - Server Error"}
        url={site?.url + "500"}
      />
      {page}
    </>
  );
};
