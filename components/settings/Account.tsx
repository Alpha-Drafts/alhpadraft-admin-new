import React from "react";

import Image from "next/image";
import { Eye, EyeOff, Lock, User } from "lucide-react";
import { Button } from "@/common";
import { useCurrentUser } from "@/hooks/auth/useCurrentUser";
import apiClient from "@/utils/api/apiClient";
import { useState } from "react";
import { toast } from "react-toastify";

const SettingsContent = () => {
  const { currentUser } = useCurrentUser();

  // Security form state
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    const sanitisedPassword = newPassword.trim();
    const sanitisedConfirmPassword = confirmPassword.trim();

    if (!sanitisedPassword || !sanitisedConfirmPassword) {
      setError("All fields are required");
      return;
    }

    if (sanitisedPassword !== sanitisedConfirmPassword) {
      setError("Passwords do not match");
      return;
    }

    const passwordPattern =
      /^(?=.*[A-Z])(?=.*[a-z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{6,20}$/;

    if (!passwordPattern.test(sanitisedPassword)) {
      setError(
        "Password must be 6-20 chars, include upper & lower case letters, a number and a special char.",
      );
      return;
    }

    if (isProcessing) return;

    setIsProcessing(true);
    try {
      await apiClient.patch(`/v1/users/update-password`, {
        password: sanitisedPassword,
      });
      setNewPassword("");
      setConfirmPassword("");
      toast.success("Password changed successfully");
    } catch (err: unknown) {
      const message =
        (err as { message?: string })?.message ??
        "Failed to change password. Please try again.";
      setError(message);
      toast.error(message);
    } finally {
      setIsProcessing(false);
    }
  };

  const displayName = currentUser?.displayName || "—";
  const email = currentUser?.email || "—";
  const photoURL = currentUser?.photoURL || "";

  return (
    <div className="w-full">
      <h1 className="mb-6 text-2xl font-medium">Settings</h1>

      <div className="flex flex-col gap-6 lg:flex-row lg:items-start">
        <section className="mx-auto w-full max-w-md flex-1 rounded-lg border border-gray-200 bg-white p-6 shadow-sm lg:mx-0">
          <header className="mb-6">
            <h2 className="text-base font-medium text-black">
              Account details
            </h2>
            <p className="mt-1 text-sm text-gray-500">
              Your profile information.
            </p>
          </header>

          <div className="mb-6 flex items-center gap-4">
            <div className="relative h-[72px] w-[72px] overflow-hidden rounded-full bg-gray-100">
              {photoURL ? (
                <Image
                  src={photoURL}
                  alt="Profile photo"
                  fill
                  className="object-cover"
                />
              ) : (
                <div className="flex h-full w-full items-center justify-center">
                  <User className="h-6 w-6 text-gray-400" />
                </div>
              )}
            </div>

            <div className="min-w-0">
              <p className="truncate text-sm font-medium text-black">
                {displayName}
              </p>
              <p className="truncate text-sm text-gray-600">{email}</p>
            </div>
          </div>

          <div className="grid gap-4 sm:grid-cols-1">
            <div>
              <label className="block text-sm font-medium text-black">
                Full name
              </label>
              <input
                title="displayName"
                type="text"
                value={displayName}
                readOnly
                disabled
                className="mt-1 w-full rounded-md border border-gray-200 bg-gray-50 px-3 py-2 text-sm text-gray-700 focus:outline-hidden"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-black">
                Email
              </label>
              <input
                title="email"
                type="email"
                value={email}
                readOnly
                disabled
                className="mt-1 w-full rounded-md border border-gray-200 bg-gray-50 px-3 py-2 text-sm text-gray-700 focus:outline-hidden"
              />
            </div>
          </div>
        </section>

        <section className="mx-auto w-full max-w-md space-y-6 lg:mx-0">
          <form
            onSubmit={onSubmit}
            className="rounded-lg border border-gray-200 bg-white p-6 shadow-sm"
            aria-busy={isProcessing}
          >
            <header className="mb-6">
              <h2 className="text-base font-medium text-black">Security</h2>
              <p className="mt-1 text-sm text-gray-500">
                Change your password.
              </p>
            </header>

            <div className="space-y-5">
              <div>
                <label className="block text-sm font-medium text-black">
                  New password
                </label>
                <div className="relative mt-1">
                  <input
                    type={showNewPassword ? "text" : "password"}
                    value={newPassword}
                    onChange={e => setNewPassword(e.target.value)}
                    disabled={isProcessing}
                    placeholder="Enter new password"
                    className={`w-full rounded-md border px-3 py-2 text-sm text-black placeholder:text-gray-500 focus:outline-hidden ${
                      error ? "border-red-500" : "border-gray-300"
                    }`}
                  />
                  <button
                    type="button"
                    disabled={isProcessing}
                    className="absolute top-1/2 right-3 -translate-y-1/2 text-gray-500"
                    onClick={() => setShowNewPassword(v => !v)}
                  >
                    {showNewPassword ? (
                      <Eye className="h-5 w-5" />
                    ) : (
                      <EyeOff className="h-5 w-5" />
                    )}
                  </button>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-black">
                  Confirm password
                </label>
                <div className="relative mt-1">
                  <input
                    type={showConfirmPassword ? "text" : "password"}
                    value={confirmPassword}
                    onChange={e => setConfirmPassword(e.target.value)}
                    disabled={isProcessing}
                    placeholder="Confirm new password"
                    className={`w-full rounded-md border px-3 py-2 text-sm text-black placeholder:text-gray-500 focus:outline-hidden ${
                      error ? "border-red-500" : "border-gray-300"
                    }`}
                  />
                  <button
                    type="button"
                    disabled={isProcessing}
                    className="absolute top-1/2 right-3 -translate-y-1/2 text-gray-500"
                    onClick={() => setShowConfirmPassword(v => !v)}
                  >
                    {showConfirmPassword ? (
                      <Eye className="h-5 w-5" />
                    ) : (
                      <EyeOff className="h-5 w-5" />
                    )}
                  </button>
                </div>
              </div>

              {error && <p className="text-xs text-red-600">{error}</p>}

              <Button
                type="submit"
                text="Change password"
                icon={<Lock className="h-4 w-4" />}
                className="px-4 py-2"
                disabled={isProcessing || !newPassword || !confirmPassword}
              />
            </div>
          </form>
        </section>
      </div>
    </div>
  );
};

export default SettingsContent;
