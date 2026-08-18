import React, { useState } from "react";
import Link from "next/link";
import { authRoutes } from "@/constants";
import { apiClient, ensureCsrfToken, formatError } from "@/utils";
import { Loader2, Zap } from "lucide-react";
import { Button, Modal } from "@/common";
import AuthHeader from "./AuthHeader";

const ForgotPasswordForm = () => {
  const [email, setEmail] = useState("");
  const [showModal, setShowModal] = useState<boolean>(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState("");

  const isDisabled = isProcessing;

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError("");
    setIsProcessing(true);

    const sanitisedEmail = email.trim().toLocaleLowerCase();

    if (!sanitisedEmail) {
      setError("Email is required");
      return;
    }

    try {
      await ensureCsrfToken();
      const response = await apiClient.post("/v1/auth/forgot-password", {
        email: email.trim().toLowerCase(),
      });

      if (response.data.status === "success") {
        setShowModal(true);
        return;
      }
    } catch (error) {
      setError(
        formatError(error, "An error occurred while sending reset link"),
      );
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <>
      <Modal
        isOpen={showModal}
        icon={<Zap className="icon" />}
        title="Email Sent"
        message="If your email is registered, you will receive a password reset link shortly."
        cancelText="Close"
        onCancel={() => setShowModal(false)}
      />

      <div className="auth auth-single-column">
        <div className="auth-content">
          <AuthHeader />

          <main className="auth-content_body">
            <header className="auth-content_header">
              <h1 className="auth-content_title">Forgot password?</h1>
              <p className="auth-content_sub-title">
                Remember your password?{" "}
                <Link className="auth-content_link" href={authRoutes?.login}>
                  Sign in here
                </Link>
              </p>
            </header>

            <section className="auth-content_section">
              {/* Form */}
              <form onSubmit={handleSubmit} className="auth-content_form">
                {/* Form Group */}
                <div>
                  <label htmlFor="email">Email address</label>
                  <div className="relative">
                    <input
                      type="email"
                      id="email"
                      name="email"
                      required
                      value={email}
                      onChange={e => setEmail(e.target.value)}
                    />
                  </div>
                </div>
                {/* End Form Group */}

                {/* Display error message */}
                {error && <p className="error-message">{error}</p>}

                <Button
                  type="submit"
                  disabled={isDisabled}
                  icon={
                    isProcessing ? <Loader2 className="loader" /> : undefined
                  }
                >
                  {isProcessing ? "Sending Email..." : "Send reset link"}
                </Button>
              </form>
              {/* End Form */}
            </section>
          </main>
        </div>
      </div>
    </>
  );
};

export default ForgotPasswordForm;
