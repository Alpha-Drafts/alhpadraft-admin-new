import React, { useRef, useState } from "react";
import { ChevronDown } from "lucide-react";
import { DropdownProps } from "@/types";
import { useCloseMenuWhenClickedOutside } from "@/hooks";
import clsx from "clsx";

// Base styling classes for all dropdown variants
const baseClasses = `inline-flex items-center justify-center gap-2 rounded-full text-body-medium-16 text-neutral-800 focus:outline-none`;

// Styling classes for different dropdown variants
const variantClasses: Record<NonNullable<DropdownProps["variant"]>, string> = {
  plain: "border-none bg-transparent p-0",
  outline: "border border-neutral-200 bg-white px-3 py-2",
};

/**
 * A dropdown component that displays a list of selectable options.
 * @param {string} label - The text to display on the dropdown button
 * @param {string[]} options - Array of options to display in the dropdown menu
 * @param {string} selectedOption - Currently selected option
 * @param {Function} onSelect - Callback function when an option is selected
 * @param {"outline" | "plain"} variant - Visual style of the dropdown (default: "outline")
 * @param {string} className - Additional CSS classes
 */

export const Dropdown = ({
  label,
  options,
  selectedOption,
  onSelect,
  variant = "outline",
  className = "",
  ...props
}: DropdownProps) => {
  // State to control dropdown menu visibility
  const [isOpen, setIsOpen] = useState(false);

  // Combine base classes with variant-specific classes and any additional classes
  const dropdownClass = clsx(baseClasses, variantClasses[variant], className);

  // Reference to the dropdown container for click outside detection
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Use custom hook to handle clicking outside of dropdown
  useCloseMenuWhenClickedOutside({
    showMenu: isOpen,
    showMenuRef: dropdownRef,
    setShowMenu: setIsOpen,
  });

  return (
    <div className="relative" ref={dropdownRef} {...props}>
      {/* Dropdown trigger button */}
      <button onClick={() => setIsOpen(!isOpen)} className={dropdownClass}>
        <span className="capitalize">{label}</span>
        <ChevronDown className="h-4 w-4" />
      </button>

      {/* Dropdown menu */}
      {isOpen && (
        <ul className="absolute right-0 z-10 mt-2 max-h-[300px] w-52 overflow-y-auto rounded-md border border-neutral-100 bg-white shadow-sm">
          {options.map(option => (
            <li
              key={option}
              onClick={() => {
                onSelect(option);
                setIsOpen(false);
              }}
              className={`cursor-pointer px-4 py-2 capitalize hover:bg-neutral-100 ${
                selectedOption === option
                  ? "text-primary-500 font-semibold"
                  : "font-medium"
              }`}
            >
              {/* Replace underscores with spaces in option text */}
              {option.replace(/_/g, " ")}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};
