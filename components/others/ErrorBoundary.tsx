import React from "react";
import { FallbackProps } from "react-error-boundary";
import { useRouter } from "next/router";
import { AlertTriangle } from "lucide-react";

const ErrorFallback = ({ error, resetErrorBoundary }: FallbackProps) => {
  const router = useRouter();

  const handleRetry = () => {
    resetErrorBoundary();
  };

  const handleGoHome = () => {
    router.push("/");
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-50 p-5">
      <div className="w-full max-w-md rounded-lg bg-white p-8 text-center shadow-lg">
        <div className="mb-4 flex justify-center">
          <AlertTriangle size={50} className="text-amber-500" />
        </div>

        <h2 className="text-heading-4 mb-4 text-neutral-900">
          Something went wrong
        </h2>

        <div className="text-body-regular-16 mb-6 text-neutral-600">
          <p className="mb-2">
            We encountered an error while processing your request.
          </p>
          <div className="text-body-regular-14 mt-4 mb-4 max-h-32 overflow-auto rounded-md bg-red-50 p-3 text-left text-red-700">
            {error.message || "An unexpected error occurred"}
          </div>
        </div>

        <div className="flex flex-col justify-center space-y-3 sm:flex-row sm:space-y-0 sm:space-x-3">
          <button
            onClick={handleRetry}
            className="bg-primary-600 hover:bg-primary-700 rounded-full px-5 py-2 text-white transition-colors duration-200"
          >
            Try again
          </button>
          <button
            onClick={handleGoHome}
            className="rounded-full bg-neutral-200 px-5 py-2 text-neutral-800 transition-colors duration-200 hover:bg-neutral-300"
          >
            Go to home page
          </button>
        </div>
      </div>
    </div>
  );
};

export default ErrorFallback;
