import ForgotPasswordForm from "@/components/auth/ForgotPasswordForm";
import site from "@/site.metadata";
import { CustomHead } from "@/utils";
import React from "react";

const Page = () => {
  return <ForgotPasswordForm />;
};

export default Page;

Page.getLayout = function PageLayout(page: React.ReactNode) {
  return (
    <>
      <CustomHead title={site?.title + " - " + "Forgot Password"} />
      {page}
    </>
  );
};
