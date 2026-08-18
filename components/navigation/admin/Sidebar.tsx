import React from "react";
import {
  LayoutDashboard,
  UserRound,
  ChevronUp,
  ChevronDown,
  LogOut,
  Cog,
  UserCog,
  FileText,
  CreditCard,
} from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import { ADMINS_ENABLED, adminRoutes } from "@/constants";
import { usePathname } from "next/navigation";
import { useSignOutUser } from "@/hooks";
import logo from "@/public/logo.svg";
import { NavItemProps } from "@/types";

const STYLES = {
  link: "flex items-center gap-x-3.5 rounded-lg px-2.5 py-2 text-body-semibold-16 text-black no-underline hover:text-primary-600 focus:bg--primary-600 focus:outline-none transition-colors",
  accordionButton:
    "hs-accordion-toggle flex w-full items-center gap-x-3.5 rounded-lg px-2.5 py-2 text-start text-body-semibold-16 text-black no-underline hover:text-primary-600 focus:text-primary-600 focus:outline-none text-body-semibold-16",
  accordionContent:
    "hs-accordion-content hidden w-full overflow-hidden transition-[height] duration-300 ",
  iconSize: "size-5 shrink-0",
  hrStyle: "my-3 border-t border-neutral-200",
};

const AccordionItem = ({ item }: { item: NavItemProps }) => {
  if (!item.subLinks || item.subLinks.length === 0) {
    return (
      <li>
        <Link
          href={item.href || adminRoutes?.overview}
          className={`${STYLES.link} ${item.isActive ? "text-primary-600" : ""}`}
        >
          {item.icon}
          {item.name}
        </Link>
      </li>
    );
  }

  return (
    <li className="hs-accordion" id={`${item.name}-accordion`}>
      <button
        type="button"
        className={`${STYLES.accordionButton} ${item.isActive ? "text-primary-600" : ""}`}
        aria-expanded="true"
        aria-controls={`${item.name}-accordion-child`}
      >
        {item.icon}
        {item.name}
        <ChevronUp
          className={`hs-accordion-active:block ms-auto hidden ${STYLES.iconSize}`}
        />
        <ChevronDown
          className={`hs-accordion-active:hidden ms-auto block ${STYLES.iconSize}`}
        />
      </button>

      <div
        id={`${item.name}-accordion-child`}
        className={STYLES.accordionContent}
        role="region"
        aria-labelledby={`${item.name}-accordion`}
      >
        <ul className="space-y-1 ps-8 pt-1">
          {item.subLinks && item.subLinks.length > 0
            ? item.subLinks.map(child => (
                <AccordionItem key={child.name} item={child} />
              ))
            : null}
        </ul>
      </div>
    </li>
  );
};

const Sidebar = () => {
  const pathname = usePathname() || "";
  const { signOutUser } = useSignOutUser();

  const NAV_LINKS: NavItemProps[] = [
    {
      name: "Overview",
      href: adminRoutes?.overview,
      isActive: pathname === adminRoutes?.overview,
      icon: <LayoutDashboard size={20} />,
      title: "Admin Dashboard",
    },
    {
      name: "Users",
      href: adminRoutes?.users,
      isActive: pathname === adminRoutes?.users,
      icon: <UserRound size={20} />,
      title: "Users",
    },
    {
      name: "Subscriptions",
      href: adminRoutes?.subscriptions,
      isActive: pathname === adminRoutes?.subscriptions,
      icon: <CreditCard size={20} />,
      title: "Subscriptions",
    },
    {
      name: "Projects",
      href: adminRoutes?.projects,
      isActive: pathname === adminRoutes?.projects,
      icon: <FileText size={20} />,
      title: "Projects",
    },
    ...(ADMINS_ENABLED
      ? [
          {
            name: "Admins",
            href: adminRoutes?.admins,
            isActive: pathname === adminRoutes?.admins,
            icon: <UserCog size={20} />,
            title: "Admins",
          },
        ]
      : []),
    // {
    //   name: "Customers",
    //   href: adminRoutes?.users,
    //   isActive: pathname.includes(adminRoutes?.users),
    //   icon: <Bot size={20} />,
    //   title: "Customers",
    //   subLinks: [
    //     {
    //       name: "Founders",
    //       href: adminRoutes?.users,
    //       isActive: pathname === adminRoutes?.users,
    //       icon: <Bot size={16} />,
    //       title: "Founders",
    //     },
    //   ],
    // },
  ];

  const USER_href: NavItemProps[] = [
    {
      name: "Settings",
      href: adminRoutes?.settings,
      isActive: pathname === adminRoutes?.settings,
      icon: <Cog size={20} />,
    },
  ];

  return (
    <div
      id="hs-application-sidebar"
      className="hs-overlay hs-overlay-open:translate-x-0 fixed inset-y-0 start-0 z-[60] hidden h-full w-[260px] -translate-x-full transform border-e border-neutral-100 bg-white transition-all duration-300 [--auto-close:lg] lg:end-auto lg:bottom-0 lg:block lg:translate-x-0"
      role="dialog"
      tabIndex={-1}
    >
      <div className="flex h-full flex-col">
        {/* Fixed Header */}
        <div className="flex items-center px-6 py-4">
          <Link
            className="inline-block flex-none text-xl font-semibold"
            href={adminRoutes?.overview}
          >
            <Image
              alt="Nigerian-Made Logo"
              src={logo}
              width={110}
              height={36}
              priority
            />
          </Link>
        </div>

        {/* Scrollable Navigation Section */}
        <div className="flex flex-1 flex-col overflow-y-auto">
          <nav
            className="hs-accordion-group flex w-full flex-col flex-wrap p-3"
            data-hs-accordion-always-open
          >
            <ul className="flex flex-col space-y-1">
              {NAV_LINKS.map(item => (
                <AccordionItem key={item.name} item={item} />
              ))}

              <div className="">
                <hr className={STYLES.hrStyle} />
              </div>

              {USER_href.map(item => (
                <AccordionItem key={item.name} item={item} />
              ))}
            </ul>
          </nav>
        </div>

        {/* Fixed Footer */}
        <div className="border-t border-neutral-100 bg-white p-4">
          <button
            className={`w-full ${STYLES.link}`}
            type="button"
            onClick={() => {
              signOutUser();
            }}
          >
            <LogOut className={STYLES.iconSize} />
            Logout
          </button>
        </div>
      </div>
    </div>
  );
};
export default Sidebar;
