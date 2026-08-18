import { BreadcrumbProps } from "@/types";
import { ChevronRight, PanelLeftOpen } from "lucide-react";
import Link from "next/link";
import { useState, useRef, useEffect } from "react";

const MobileNavigation = ({
  breadcrumbs = [],
}: {
  breadcrumbs: BreadcrumbProps[];
}) => {
  const [showAll, setShowAll] = useState(false);
  const ellipsisRef = useRef<HTMLButtonElement | null>(null);
  const dropdownRef = useRef<HTMLUListElement | null>(null);

  // Close dropdown on outside click
  useEffect(() => {
    if (!showAll) return;
    function handleClick(e: MouseEvent) {
      if (
        !dropdownRef.current?.contains(e.target as Node) &&
        !ellipsisRef.current?.contains(e.target as Node)
      ) {
        setShowAll(false);
      }
    }
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, [showAll]);

  const displayedBreadcrumbs =
    breadcrumbs.length <= 2
      ? breadcrumbs
      : [
          breadcrumbs[0],
          { name: "...", href: "#" },
          breadcrumbs[breadcrumbs.length - 1],
        ];

  return (
    <div className="-mt-px">
      <div className="sticky inset-x-0 top-0 z-20 bg-white px-4 shadow sm:px-6 lg:hidden lg:px-8">
        <div className="flex items-center py-2">
          <button
            type="button"
            className="flex size-8 min-h-8 min-w-8 items-center justify-center gap-x-2 rounded-lg border border-neutral-300 text-neutral-800 hover:text-neutral-500 focus:text-neutral-500 focus:outline-none disabled:pointer-events-none disabled:opacity-50"
            aria-haspopup="dialog"
            aria-expanded="false"
            aria-controls="hs-application-sidebar"
            aria-label="Toggle navigation"
            data-hs-overlay="#hs-application-sidebar"
          >
            <span className="sr-only">Toggle Navigation</span>
            <PanelLeftOpen className="size-4 shrink-0" />
          </button>

          <ol className="ms-3 flex items-center overflow-hidden whitespace-nowrap">
            {displayedBreadcrumbs.map((item, index) => {
              const isLast = index === displayedBreadcrumbs.length - 1;

              // Handle the ellipsis button
              if (item.name === "...") {
                return (
                  <li key="ellipsis" className="flex items-center">
                    <button
                      type="button"
                      className="text-body-semibold-16 hover:text-primary-600 px-1 text-neutral-800 underline"
                      onClick={() => setShowAll(v => !v)}
                      aria-label="Show more breadcrumbs"
                      ref={ellipsisRef}
                    >
                      ...
                    </button>
                    <ChevronRight className="mx-3 size-4 shrink-0 overflow-visible text-neutral-400" />
                    {showAll && (
                      <ul
                        ref={dropdownRef}
                        className="absolute top-full left-0 z-30 mx-10 mt-2 flex w-fit min-w-[120px] flex-wrap items-center overflow-hidden rounded-md border border-neutral-200 bg-white px-4 py-2 shadow-lg"
                      >
                        {breadcrumbs
                          .slice(1, breadcrumbs.length - 1)
                          .map((crumb, idx, arr) => (
                            <li key={crumb.name} className="flex items-center">
                              <Link
                                href={crumb.href}
                                className="text-body-semibold-14 hover:text-primary-600 block text-neutral-800 no-underline transition-all hover:underline"
                                onClick={() => setShowAll(false)}
                              >
                                {crumb.name}
                              </Link>
                              {/* Only show chevron if not last item */}
                              {idx < arr.length - 1 && (
                                <ChevronRight className="mx-3 size-4 shrink-0 overflow-visible text-neutral-400" />
                              )}
                            </li>
                          ))}
                      </ul>
                    )}
                  </li>
                );
              }

              if (isLast) {
                return (
                  <li
                    key={item.name}
                    className="text-body-semibold-16 text-primary-600 truncate"
                    aria-current="page"
                  >
                    {item.name}
                  </li>
                );
              }

              return (
                <li key={item.name} className="flex items-center">
                  {item.href && item.name !== "..." ? (
                    <Link
                      href={item.href}
                      className="text-body-semibold-16 hover:text-primary-600 text-neutral-800 no-underline transition-all hover:underline"
                    >
                      {item.name}
                    </Link>
                  ) : (
                    item.name
                  )}
                  <ChevronRight className="mx-3 size-4 shrink-0 overflow-visible text-neutral-400" />
                </li>
              );
            })}
          </ol>
        </div>
      </div>
    </div>
  );
};
export default MobileNavigation;
