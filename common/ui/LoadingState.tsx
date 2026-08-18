import React from "react";
import Image from "next/image";
import site from "@/site.metadata";

export const LoadingState = () => {
  return (
    <div className="fixed top-0 left-0 z-[100000] flex h-full w-full items-center justify-center bg-black/30">
      <div className="relative flex h-[100px] w-[100px] items-center justify-center">
        <div className="animate-scale">
          <Image src={site.icon} alt={site.title} width={100} height={100} />
        </div>
      </div>
    </div>
  );
};
