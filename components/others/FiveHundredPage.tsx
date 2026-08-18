import { AlertTriangle } from "lucide-react";
import Link from "next/link";
import React from "react";

const FiveHundredPage = () => {
  return (
    <div className="flex min-h-[80vh] items-center justify-center">
      <div className="mx-auto max-w-screen-lg space-y-8 px-[36px] py-6 lg:px-[72px] lg:py-12">
        <div className="flex justify-center">
          <AlertTriangle size={80} className="text-amber-500" />
        </div>
        <div className="space-y-4 text-center">
          <h1 className="text-heading-3">Server Error</h1>
          <p className="font-medium">
            Sorry, something went wrong on our server. We&apos;re working to fix
            the issue.
          </p>
          <div className="mx-auto inline-flex gap-x-2">
            <Link
              className="text-body-bold-20 text-primary-500 underline"
              href="/"
            >
              Back to Home
            </Link>
            <button
              className="text-body-bold-20 text-primary-500 underline"
              onClick={() => window.location.reload()}
            >
              Try Again
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FiveHundredPage;
