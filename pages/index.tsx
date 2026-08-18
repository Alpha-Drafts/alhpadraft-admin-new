import LoginForm from "@/components/auth/LoginForm";
import site from "@/site.metadata";
import { CustomHead } from "@/utils";
import React from "react";

const Page = () => {
  return <LoginForm />;
};

export default Page;

Page.getLayout = function PageLayout(page: React.ReactNode) {
  return (
    <>
      <CustomHead
        title={site?.title + " -  Login"}
        url={site?.url + "/auth/login"}
      />
      {page}
    </>
  );
};
