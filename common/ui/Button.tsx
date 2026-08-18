import React from "react";
import Link from "next/link";
import clsx from "clsx";
import { ButtonProps } from "@/types";

// Size classes
const sizeClasses: Record<NonNullable<ButtonProps["size"]>, string> = {
  sm: "py-2 px-3 text-xs",
  md: "py-3 px-4 text-sm",
  lg: "py-4 px-6 text-base",
};

// Rounded classes
const roundedClasses: Record<NonNullable<ButtonProps["rounded"]>, string> = {
  sm: "rounded",
  md: "rounded-md",
  lg: "rounded-lg",
  full: "rounded-full aspect-square",
};

// Base styling classes for all button variants
const baseClasses =
  "inline-flex items-center gap-x-2 font-medium transition-colors disabled:opacity-50 disabled:pointer-events-none";

// Styling classes for different button variants
const variantClasses: Record<NonNullable<ButtonProps["variant"]>, string> = {
  primary:
    "border border-transparent bg-primary-600 text-white hover:bg-primary-700 focus:outline-hidden focus:bg-primary-700",
  secondary:
    "border border-transparent bg-neutral-600 text-white hover:bg-neutral-700 focus:outline-hidden focus:bg-neutral-700",
  outline:
    "border border-gray-200 text-gray-500 hover:border-primary-600 hover:text-primary-600 focus:outline-hidden focus:border-primary-600 focus:text-primary-600 dark:border-neutral-700 dark:text-neutral-400 dark:hover:text-primary-500 dark:hover:border-primary-600 dark:focus:text-primary-500 dark:focus:border-primary-600",
  plain:
    " border border-transparent text-primary-600 hover:bg-primary-100 hover:text-primary-800 focus:outline-hidden focus:bg-primary-100 focus:text-primary-800 dark:text-primary-500 dark:hover:bg-primary-800/30 dark:hover:text-primary-400 dark:focus:bg-primary-800/30 dark:focus:text-primary-400",
  danger:
    "border border-transparent bg-red-600 text-white hover:bg-red-700 focus:outline-hidden focus:bg-red-700",
  link: "!p-0 text-primary-600 hover:text-primary-800 focus:outline-hidden focus:text-primary-800 dark:text-primary-500 dark:hover:text-primary-400 dark:focus:text-primary-400",
};

/**
 * A versatile Button component that supports multiple variants and can render as either a button or a link.
 * @param {string} text - The text content of the button
 * @param {string} id - Unique identifier for the button
 * @param {"button" | "submit" | "reset"} type - The type of button (default: "button")
 * @param {string} className - Additional CSS classes
 * @param {Function} onClick - Click event handler
 * @param {boolean} disabled - Whether the button is disabled
 * @param {boolean} hidden - Whether the button should be hidden
 * @param {React.ReactNode} children - Alternative to text prop for button content
 * @param {string} link - If provided, renders as a Next.js Link component
 * @param {string} title - Button tooltip text
 * @param {React.ReactNode} icon - Icon element to display
 * @param {"left" | "right"} iconPosition - Position of the icon relative to text
 * @param {"primary" | "secondary" | "outline" | "plain" | "danger" | "link"} variant - Button style variant
 */
export function Button({
  text,
  id,
  type = "button",
  className = "",
  onClick,
  disabled = false,
  hidden = false,
  children,
  link,
  title,
  icon,
  iconPosition = "left",
  variant = "primary",
  size = "md",
  rounded = "md",
  ...props
}: ButtonProps) {
  // Early return if button should be hidden
  if (hidden) return null;

  // Compose button content with optional icon
  const content = (
    <span
      className={`mx-auto ${icon ? "inline-flex items-center justify-center gap-1" : ""}`}
    >
      {icon && iconPosition === "left" && <span className="mr-2">{icon}</span>}
      {text ?? children}
      {icon && iconPosition === "right" && <span className="ml-2">{icon}</span>}
    </span>
  );

  // Combine base classes with size, rounded, variant-specific classes and any additional classes
  const buttonClass = clsx(
    baseClasses,
    sizeClasses[size || "md"],
    roundedClasses[rounded || "md"],
    variantClasses[variant],
    className,
  );

  // Render as Link if link prop is provided
  if (link) {
    return (
      <Link
        href={link}
        id={id}
        className={buttonClass}
        title={title}
        {...props}
      >
        {content}
      </Link>
    );
  }

  // Render as regular button
  return (
    <button
      id={id}
      type={type}
      onClick={onClick}
      disabled={disabled}
      className={buttonClass}
      title={title}
      {...props}
    >
      {content}
    </button>
  );
}
