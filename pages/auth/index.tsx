import React, { useEffect, useState } from "react";
import { useRouter } from "next/router";
import { apiClient, CustomHead, ensureCsrfToken, formatError } from "@/utils";
import ResetPasswordForm from "@/components/auth/ResetPasswordForm";
import EmailVerifiedMessage from "@/components/auth/EmailVerifiedMessage";

type VerificationStatus = "processing" | "success" | "failed";

const Page = () => {
  const router = useRouter();
  const { query } = router;
  const [verificationStatus, setVerificationStatus] =
    useState<VerificationStatus>("processing");
  const [errorMessage, setErrorMessage] = useState<string>("");

  const queryWithProps = {
    oobCode: typeof query.oobCode === "string" ? query.oobCode : "",
    continueUrl: typeof query.continueUrl === "string" ? query.continueUrl : "",
    mode: typeof query.mode === "string" ? query.mode : "",
  };

  useEffect(() => {
    if (queryWithProps.mode === "verifyEmail") {
      (async () => {
        try {
          await ensureCsrfToken();
          const response = await apiClient.post("/v1/auth/verify-email", {
            token: queryWithProps.oobCode,
          });
          if (response.data.status === "success") {
            setVerificationStatus("success");
          } else {
            setVerificationStatus("failed");
            setErrorMessage(response.data.message || "Failed to verify email");
          }
        } catch (error) {
          const errorMsg = formatError(error, "Failed to verify email");
          setVerificationStatus("failed");
          setErrorMessage(errorMsg);
        }
      })();
    }
  }, [queryWithProps.mode, queryWithProps.oobCode, router]);

  return (
    <div>
      {queryWithProps.mode === "resetPassword" && (
        <ResetPasswordForm query={queryWithProps} />
      )}
      {queryWithProps.mode === "verifyEmail" && (
        <EmailVerifiedMessage
          verificationStatus={verificationStatus}
          errorMessage={errorMessage}
        />
      )}
    </div>
  );
};

export default Page;

Page.getLayout = function PageLayout(page: React.ReactNode) {
  return (
    <>
      <CustomHead />
      {page}
    </>
  );
};
