import { useCloseMenuWhenClickedOutside } from "@/hooks";
import { TableColumnActionsProps } from "@/types";
import { EllipsisVertical } from "lucide-react";
import { useRef, useState } from "react";

/**
 * A component that renders a dropdown menu of actions in a table column
 * @param {TableColumnActionsProps} actions - Object containing action items and optional icon
 */
export const TableColumnActions = ({
  actions,
}: {
  actions: TableColumnActionsProps;
}) => {
  // State and ref for dropdown functionality
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement | null>(null);

  // Use the hook to close the dropdown when clicking outside
  useCloseMenuWhenClickedOutside({
    showMenu: isOpen,
    showMenuRef: dropdownRef,
    setShowMenu: setIsOpen,
  });

  /**
   * Handles action item click and closes dropdown
   * @param {Function} action - Callback function for the action
   */
  const handleActionClick = (action: () => void) => {
    action();
    setIsOpen(false); // Close the dropdown after an action is clicked
  };

  return (
    <td className="size-px overflow-visible whitespace-nowrap">
      <div className="px-6 py-2">
        <div className="relative inline-block" ref={dropdownRef}>
          <button
            type="button"
            onClick={() => setIsOpen(prev => !prev)} // Toggle dropdown visibility
            className="text-body-medium-16 focus:ring-primary-500 inline-flex items-center justify-center gap-2 rounded-[6px] px-2 py-1.5 text-neutral-700 transition-all focus:ring-2 focus:ring-offset-2 focus:ring-offset-white focus:outline-none disabled:pointer-events-none disabled:opacity-50"
          >
            {actions?.icon ? (
              <actions.icon className="size-4 shrink-0" />
            ) : (
              <EllipsisVertical className="size-4 shrink-0" />
            )}
          </button>
          {isOpen && (
            <div
              className="absolute right-0 z-20 mt-2 min-w-40 divide-y divide-neutral-200 rounded-lg bg-white p-2 shadow-2xl"
              role="menu"
              aria-orientation="vertical"
            >
              <div className="py-2 first:pt-0 last:pb-0">
                {actions?.items?.length === 0 ? (
                  <span className="text-body-medium-16 block px-3 py-2 text-neutral-800">
                    No Action
                  </span>
                ) : (
                  actions?.items?.map((action, index) => (
                    <button
                      type="button"
                      key={index}
                      onClick={() => handleActionClick(action?.action)}
                      className={`text-body-medium-16 flex w-full items-center gap-x-3 rounded-lg px-3 py-2 hover:bg-neutral-100 focus:bg-neutral-100 focus:outline-none ${
                        action?.variant === "danger"
                          ? "text-red-500"
                          : "text-neutral-800"
                      }`}
                    >
                      {action?.label}
                    </button>
                  ))
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </td>
  );
};
