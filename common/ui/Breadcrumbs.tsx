import { BreadcrumbProps } from "@/types";
import Link from "next/link";
import React from "react";

export const Breadcrumbs = ({ links }: { links: BreadcrumbProps[] }) => {
  // Always show the first and last items
  const firstItem = links[0];
  const lastItem = links[links.length - 1];

  // Middle items that might be collapsed
  const middleItems = links.slice(1, -1);
  const hasMiddleItems = middleItems.length > 0;

  return (
    <nav aria-label="Breadcrumbs">
      <ol className="text-body-semibold-16 flex flex-wrap items-center gap-2">
        {/* First item - always visible */}
        <li className="flex items-center gap-2 capitalize">
          <Link
            href={firstItem.href}
            className="text-body-semibold-16 hover:text-primary-600 text-black"
          >
            {firstItem.name}
          </Link>
          <span className="text-neutral-700">/</span>
        </li>

        {/* Middle items - will wrap if needed */}
        {hasMiddleItems && (
          <>
            {/* For very small screens - show ellipsis when wrapped */}
            <li className="flex items-center gap-2 capitalize sm:hidden">
              <span className="text-body-semibold-16 text-neutral-700">
                ...
              </span>
              <span className="text-neutral-700">/</span>
            </li>

            {/* Middle items - visible on larger screens */}
            {middleItems.map((link, index) => (
              <li
                key={index}
                className="hidden items-center gap-2 capitalize sm:flex"
              >
                <Link
                  href={link.href}
                  className="text-body-semibold-16 hover:text-primary-600 overflow-hidden text-ellipsis text-black"
                  title={link.name}
                >
                  {link.name}
                </Link>
                <span className="text-neutral-700">/</span>
              </li>
            ))}
          </>
        )}

        {/* Last item - always visible */}
        <li>
          <span
            className="text-body-semibold-16 overflow-hidden text-ellipsis text-neutral-700 capitalize no-underline"
            title={lastItem.name}
          >
            {lastItem.name}
          </span>
        </li>
      </ol>
    </nav>
  );
};
