import React, { useState } from "react";
import { apiClient, ensureCsrfToken, formatError } from "@/utils";
import { Eye, EyeOff, Loader2, Zap } from "lucide-react";
import { FirebaseAuthProps } from "@/types";
import { Button, Modal } from "@/common";
import AuthHeader from "./AuthHeader";
import { useRouter } from "next/router";
import { authRoutes } from "@/constants";

const ResetPasswordForm = ({ query }: FirebaseAuthProps) => {
  const { oobCode } = query;
  const router = useRouter();

  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showModal, setShowModal] = useState<boolean>(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState("");

  const isDisabled = isProcessing;

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError("");

    const sanitisedPassword = password.trim();
    const sanitisedConfirmPassword = confirmPassword.trim();

    if (!sanitisedPassword) {
      setError("Password is required");
      return;
    }

    // Password validation pattern
    // At least one uppercase letter, one lowercase letter, one number, and one special character
    // Length between 6 and 20 characters
    const passwordPattern =
      /^(?=.*[A-Z])(?=.*[a-z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{6,20}$/;

    // Validate password strength
    if (!passwordPattern.test(password)) {
      setError(
        "Password must be 6-20 characters long, contain at least one uppercase letter, one lowercase letter, one number, and one special character (e.g., @, $, !, %, *, ?, &)",
      );
      return;
    }

    if (sanitisedPassword !== sanitisedConfirmPassword) {
      setError("Passwords do not match");
      return;
    }

    try {
      setIsProcessing(true);

      await ensureCsrfToken();
      const response = await apiClient.post("/v1/auth/reset-password", {
        password: sanitisedPassword,
        token: oobCode,
      });

      if (response.data.status === "success") {
        setShowModal(true);
        return;
      } else {
        setError(
          formatError(
            response.data.error,
            "An error occurred while sending reset link",
          ),
        );
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
        title="Password Updated"
        message="Your password has been successfully updated. You can now log in with your new password."
        cancelText="Close"
        onCancel={() => {
          setShowModal(false);
          router.push(authRoutes?.login);
        }}
      />

      <div className="auth auth-single-column">
        <div className="auth-content">
          <AuthHeader />

          <main className="auth-content_body">
            <header className="auth-content_header">
              <h1 className="auth-content_title">Create new password</h1>
            </header>

            <section className="auth-content_section">
              {/* Form */}
              <form onSubmit={handleSubmit} className="auth-content_form">
                {/* Form Group */}
                <div>
                  <div>
                    <label htmlFor="password">Password</label>
                  </div>
                  <div className="auth-content_form_input">
                    <input
                      type={showPassword ? "text" : "password"}
                      id="password"
                      name="password"
                      value={password}
                      onChange={e => setPassword(e.target.value)}
                      required
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="auth-content_visibility-button"
                    >
                      {showPassword ? (
                        <EyeOff className="icon" />
                      ) : (
                        <Eye className="icon" />
                      )}
                    </button>
                  </div>
                </div>
                {/* End Form Group */}

                {/* Form Group */}
                <div>
                  <div>
                    <label htmlFor="confirm-password">Confirm password</label>
                  </div>
                  <div className="auth-content_form_input">
                    <input
                      type={showPassword ? "text" : "password"}
                      id="confirm-password"
                      name="confirm-password"
                      value={confirmPassword}
                      onChange={e => setConfirmPassword(e.target.value)}
                      required
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="auth-content_visibility-button"
                    >
                      {showPassword ? (
                        <EyeOff className="icon" />
                      ) : (
                        <Eye className="icon" />
                      )}
                    </button>
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
                  {isProcessing ? "Updating..." : "Reset password"}
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

export default ResetPasswordForm;
