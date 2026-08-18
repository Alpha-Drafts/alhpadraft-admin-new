import UnauthorisedPage from "@/components/others/Unauthorised";
import { PublicLayout } from "@/layouts";
import site from "@/site.metadata";
import { CustomHead } from "@/utils";
import React from "react";

const Page = () => {
  return <UnauthorisedPage />;
};

export default Page;
Page.getLayout = function PageLayout(page: React.ReactNode) {
  return (
    <PublicLayout>
      <CustomHead
        title={site?.title + " - Unauthorised Access"}
        description="You do not have permission to access this page."
        url={site?.url + "unauthorised"}
      />
      {page}
    </PublicLayout>
  );
};
