import { UserRound, Cog, LogOut } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import React, { useEffect, useRef, useState } from "react";
import { authRoutes, adminRoutes } from "@/constants";
import logo from "@/public/logo.svg";
import { useDashboard } from "@/context";
import { usePathname } from "next/navigation";
import { useCurrentUser, useSignOutUser } from "@/hooks";

// CSS Classes
const STYLES = {
  dropdown: "space-y-4",
  link: "flex items-center justify-start gap-2 text-body-semibold-16 text-black no-underline hover:text-primary-500 transition-colors",
  activeLink: "text-primary-500",
} as const;

// Navigation Links
interface NavItem {
  name: string;
  href: string;
  icon: React.ReactNode;
  isActive: boolean;
  links?: NavItem[];
}

const NavBar = () => {
  const pathname = usePathname() || "";
  const { currentUser } = useCurrentUser();
  const { isAdmin } = useDashboard();
  const { signOutUser } = useSignOutUser();

  const [activeDropdown, setActiveDropdown] = useState<string | null>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setActiveDropdown(null);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const toggleDropdown = (id: string) => {
    setActiveDropdown(activeDropdown === id ? null : id);
  };

  const NAV_LINKS: NavItem[] = [
    {
      name: "Settings",
      href: adminRoutes?.settings,
      icon: <Cog className="size-4" />,
      isActive: pathname === adminRoutes?.settings,
    },
  ];

  // Recursive NavItem rendering
  const renderNavItems = (items: NavItem[]) => (
    <>
      {items.map(item => (
        <div key={item.name}>
          <Link
            className={`${STYLES.link} ${item.isActive ? STYLES.activeLink : ""}`}
            href={item.href}
            onClick={() => setActiveDropdown(null)}
          >
            {item.icon}
            {item.name}
          </Link>
          {item.links && item.links.length > 0 && (
            <div className="border-l-nuetral-200 mt-2 ml-2 space-y-2 border-l pl-4">
              {renderNavItems(item.links)}
            </div>
          )}
        </div>
      ))}
    </>
  );

  return (
    <div className="sticky top-0 z-50 bg-white shadow-sm lg:ps-[260px]">
      <nav
        ref={dropdownRef}
        className="dashboard-section relative flex w-full basis-full items-center justify-between gap-4 px-6 py-7"
      >
        <div className="flex items-center justify-between gap-x-4 md:gap-x-8">
          <Link
            className="flex-none text-xl font-semibold lg:hidden"
            href={adminRoutes?.overview}
            aria-label="Brand"
          >
            <Image
              alt="Nigerian-Made Logo"
              src={logo}
              width={150.5}
              height={39}
              priority
            />
          </Link>

          <p className="hidden text-sm lg:block">
            Welcome back,{" "}
            <strong>{currentUser?.displayName?.split(" ")[0] || "User"}</strong>
            !
          </p>
        </div>

        {isAdmin ? (
          <div className="flex items-center gap-x-2">
            {currentUser ? (
              <>
                {/* <Link
                  href={adminRoutes?.notifications}
                  className="h-9 w-9 rounded-full bg-primary-50 p-2 text-neutral-800 transition-colors hover:ring-2 hover:ring-primary-300"
                >
                  <Bell size="20" />
                </Link> */}

                <div className="relative z-10 inline-flex">
                  <button
                    onClick={() => toggleDropdown("profile")}
                    type="button"
                    className="bg-primary-50 inline-flex aspect-square h-9 w-9 items-center justify-center overflow-hidden rounded-full p-2 text-neutral-800"
                  >
                    {currentUser?.photoURL ? (
                      <Image
                        alt="User Avatar"
                        src={currentUser?.photoURL || ""}
                        width={32}
                        height={32}
                        className="aspect-square min-w-8 rounded-full object-cover"
                        priority
                      />
                    ) : (
                      <UserRound className="size-6" />
                    )}
                  </button>

                  {activeDropdown === "profile" && (
                    <div className="absolute top-full right-0 mt-2 min-w-56 space-y-4 rounded-lg bg-white p-4 shadow-sm ring-1 ring-neutral-100">
                      <div>
                        <p className="text-sm font-semibold text-neutral-500">
                          Signed in as
                        </p>
                        <p className="text-sm font-semibold text-neutral-800">
                          {currentUser?.displayName}
                        </p>
                        <hr className="mt-3 border-t border-neutral-200" />
                      </div>
                      <div className={STYLES.dropdown}>
                        {renderNavItems(NAV_LINKS)}
                        <button
                          className={STYLES.link}
                          onClick={() => {
                            signOutUser();
                            setActiveDropdown(null);
                          }}
                        >
                          <LogOut className="size-4" />
                          Logout
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              </>
            ) : (
              <>
                <Link
                  href={authRoutes?.login}
                  className="text-body-semibold-14 rounded-full text-black no-underline transition-all hover:bg-neutral-50 hover:px-4 hover:py-2"
                >
                  Login
                </Link>
              </>
            )}
          </div>
        ) : (
          <div className="flex items-center gap-x-2">
            <button
              className={STYLES.link}
              onClick={() => {
                signOutUser();
              }}
            >
              <LogOut className="size-4" />
              Logout
            </button>
          </div>
        )}
      </nav>
    </div>
  );
};

export default NavBar;
