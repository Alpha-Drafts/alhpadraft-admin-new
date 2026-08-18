import React, { useState } from "react";
import { toast } from "react-toastify";
import { Button } from "@/common";
import { apiClient, formatError } from "@/utils";
import { Mail, X } from "lucide-react";
import { useClaims } from "@/context";

const CreateAdminForm = ({ refetchCount }: { refetchCount: () => void }) => {
  const { token } = useClaims();

  const [userEmail, setUserEmail] = useState<string>("");
  const [userId, setUserId] = useState("");
  const [role, setRole] = useState<"admin" | "super_admin">("admin");
  const [isConfirming, setIsConfirming] = useState<boolean>(false);
  const [isEmailConfirmed, setIsEmailConfirmed] = useState<boolean>(false);
  const [isAdding, setIsAdding] = useState<boolean>(false);
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const [successMessage, setSuccessMessage] = useState("");
  const [errorMessage, setErrorMessage] = useState("");

  const isDisabled = () => !userEmail?.trim() || isConfirming || isAdding;

  const handleConfirmEmail = async () => {
    if (!token || !userEmail?.trim()) return;

    setUserId("");
    setIsEmailConfirmed(false);
    setSuccessMessage("");
    setErrorMessage("");
    setIsConfirming(true);

    try {
      const response = await apiClient.get(`/api/v1/admins/check-status`, {
        params: {
          email: userEmail?.trim().toLowerCase(),
          role,
        },
      });

      if (response?.data?.status === "success") {
        if (response?.data?.data?.user_id) {
          setIsEmailConfirmed(response?.data?.data?.user_id);
          setUserId(response?.data?.data?.user_id);
          setSuccessMessage("Email found, proceed to add admin.");
        } else {
          setErrorMessage("Email not found");
        }
      }
    } catch (error) {
      setErrorMessage(formatError(error, "Error confirming email"));
      setUserId("");
      setIsEmailConfirmed(false);
    } finally {
      setIsConfirming(false);
    }
  };

  const handleAddAdmin = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!token || isDisabled() || !userId) return;

    setIsAdding(true);
    setSuccessMessage("");
    setErrorMessage("");

    try {
      const response = await apiClient.post(
        `/api/v1/admins`,
        {
          user_id: userId,
          role,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      );

      if (response?.data?.status === "success") {
        toast.success("Admin created successfully.");
        refetchCount();
        resetStates();
      }
    } catch (error: unknown) {
      setErrorMessage(
        formatError(error, "Error creating admin. Please try again later."),
      );
      // Only reset these fields on error, keep the modal open
      setIsAdding(false);
      setIsConfirming(false);
    }
  };

  const resetStates = () => {
    setUserEmail("");
    setUserId("");
    setRole("admin");
    setIsConfirming(false);
    setIsEmailConfirmed(false);
    setSuccessMessage("");
    setIsAdding(false);
    setErrorMessage("");
    setIsOpen(false);
  };

  return (
    <>
      <Button
        text="Add Admin"
        onClick={() => setIsOpen(true)}
        className="bg-primary-600 hover:bg-primary-700 rounded px-4 py-2 text-white disabled:bg-gray-400"
      />

      {isOpen && (
        <div
          className="fixed inset-0 z-[100] flex items-center justify-center bg-black/50"
          onClick={e => {
            if (e.target === e.currentTarget) {
              resetStates();
            }
          }}
        >
          <div className="relative w-full max-w-md rounded-lg bg-white p-6">
            <button
              onClick={resetStates}
              className="absolute top-4 right-4 text-gray-600 hover:text-gray-900"
            >
              <X size={20} />
            </button>

            <h2 className="text-body-bold-20 mb-6">Add New Admin</h2>

            <form onSubmit={handleAddAdmin}>
              <div className="mb-4">
                <label
                  htmlFor="role"
                  className="text-body-medium-14 mb-1 block"
                >
                  Role
                </label>
                <select
                  id="role"
                  value={role}
                  onChange={e =>
                    setRole(e.target.value as "admin" | "super_admin")
                  }
                  className="mb-4 w-full rounded-lg border px-4 py-2 focus:outline-none"
                >
                  <option value="admin">Admin</option>
                  <option value="super_admin">Super Admin</option>
                </select>

                <label
                  htmlFor="email"
                  className="text-body-medium-14 mb-1 block"
                >
                  Email
                </label>
                <div className="relative">
                  <input
                    id="email"
                    type="email"
                    value={userEmail}
                    onChange={e => setUserEmail(e.target.value)}
                    placeholder="Enter email"
                    required
                    className="w-full rounded-lg border px-4 py-2 pr-10 focus:outline-none"
                  />
                  <Mail className="absolute top-1/2 right-3 size-4 -translate-y-1/2 transform" />
                </div>
                <Button
                  className="text-body-semibold-16 text-primary-600 disabled:opacity-50"
                  text={isConfirming ? "Confirming..." : "Confirm Email"}
                  variant="plain"
                  onClick={handleConfirmEmail}
                  disabled={isDisabled()}
                />
              </div>

              {successMessage && (
                <p className="text-body-semibold-14 text-primary-600 mb-2 flex w-full justify-start">
                  {successMessage}
                </p>
              )}

              {errorMessage && (
                <p className="text-body-semibold-14 text-warning-600 mb-2 flex w-full justify-start">
                  {errorMessage}
                </p>
              )}
              <Button
                type="submit"
                text={isAdding ? "Adding..." : "Add Admin"}
                disabled={isDisabled() || !isEmailConfirmed}
                className="bg-primary-600 mt-2 w-full rounded-[6px] py-2 text-white disabled:bg-neutral-200"
              />
            </form>
          </div>
        </div>
      )}
    </>
  );
};

export default CreateAdminForm;
