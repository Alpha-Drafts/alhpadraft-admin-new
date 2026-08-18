import React, { useEffect, useState } from "react";
import { LoginBanner } from "./Banners";
import Link from "next/link";
import { authRoutes } from "@/constants";
import { useLogin } from "@/hooks";
import { useRouter } from "next/router";
import { Eye, EyeOff, Loader2 } from "lucide-react";
import { Button } from "@/common";
import AuthHeader from "./AuthHeader";

const LoginForm = () => {
  const router = useRouter();
  const { redirect } = router.query;
  const redirectUrl = Array.isArray(redirect) ? redirect[0] : redirect;

  const { login, error: loginError, isProcessing } = useLogin();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    if (loginError) {
      setError(loginError);
    }
  }, [loginError]);

  const isDisabled = isProcessing;

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError("");

    const sanitisedEmail = email.trim().toLocaleLowerCase();
    const sanitisedPassword = password.trim();

    if (!sanitisedEmail || !sanitisedPassword) {
      setError("All fields are required");
      return;
    }

    await login(sanitisedEmail, sanitisedPassword, redirectUrl);
  };

  return (
    <div className="auth">
      <div className="auth-content">
        <AuthHeader />

        <main className="auth-content_body">
          <header className="auth-content_header">
            <h1 className="auth-content_title">Sign in</h1>
            <p className="auth-content_sub-title">
              Welcome back, Admin!
              <br /> Please enter your credentials.
            </p>
          </header>

          <section className="auth-content_section">
            {/* Form */}
            <form onSubmit={handleSubmit} className="auth-content_form">
              {/* Form Group */}
              <div>
                <label htmlFor="email">Email address</label>
                <div className="auth-content_form_input">
                  <input
                    type="email"
                    id="email"
                    name="email"
                    value={email}
                    onChange={e => setEmail(e.target.value)}
                    required
                  />
                </div>
              </div>
              {/* End Form Group */}

              {/* Form Group */}
              <div>
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <label htmlFor="password">Password</label>
                  <Link
                    className="auth-content_link text-sm"
                    href={authRoutes?.forgot_password}
                  >
                    Forgot password?
                  </Link>
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

              {/* Display error message */}
              {error && <p className="error-message">{error}</p>}

              <Button
                type="submit"
                disabled={isDisabled}
                icon={isProcessing ? <Loader2 className="loader" /> : undefined}
              >
                {isProcessing ? "Signing in..." : "Sign in"}
              </Button>
            </form>
            {/* End Form */}
          </section>
        </main>
      </div>

      <LoginBanner />
    </div>
  );
};

export default LoginForm;
