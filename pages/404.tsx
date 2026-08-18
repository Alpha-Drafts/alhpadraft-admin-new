import React from "react";
import site from "@/site.metadata";
import { CustomHead } from "@/utils";
import FourZeroFourPage from "@/components/others/FourZeroFourPage";

export default function Page() {
  return <FourZeroFourPage />;
}

Page.getLayout = function PageLayout(page: React.ReactNode) {
  return (
    <>
      <CustomHead
        title={site?.title + " - Page Not Found"}
        url={site?.url + "404"}
      />
      {page}
    </>
  );
};
