import Link from "next/link";
import React from "react";
import Image from "next/image";
import image from "@/public/404.svg";
import { publicRoutes } from "@/constants";

const FourZeroFourPage = () => {
  return (
    <div className="flex h-screen items-center justify-center">
      <div className="mx-auto max-w-screen-lg space-y-10 px-[36px] py-6 lg:px-[72px] lg:py-12">
        <Image
          className="mx-auto block aspect-square"
          src={image}
          width={350}
          height={350}
          objectFit="contain"
          alt="Not Found"
        />

        <div className="space-y-4 text-center">
          <h1 className="text-heading-3">
            Sorry, the page can&apos;t be found
          </h1>
          <p className="font-medium">
            The page you were looking for appears to have been moved, deleted or
            does not exist.
          </p>
          <div className="mx-auto inline-flex gap-x-2">
            <Link
              href={publicRoutes?.home}
              className="text-body-bold-20 text-primary-500 underline"
            >
              Back to Home
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FourZeroFourPage;
