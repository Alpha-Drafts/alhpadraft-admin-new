import { publicRoutes } from "@/constants";
import site from "@/site.metadata";
import Image from "next/image";
import Link from "next/link";
import React from "react";

const AuthHeader = () => {
  return (
    <nav className="auth-nav">
      <Link href={publicRoutes?.home} className="logo">
        {/* Light mode logo */}
        <Image
          alt={`${site.title} logo`}
          src={site.logo}
          width={173}
          height={50}
          className="block dark:hidden"
        />
        {/* Dark mode logo */}
        <Image
          alt={`${site.title} logo`}
          src={site.whiteLogo}
          width={173}
          height={50}
          className="hidden dark:block"
        />
      </Link>
    </nav>
  );
};

export default AuthHeader;
