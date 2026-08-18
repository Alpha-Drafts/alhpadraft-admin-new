// This file provides a custom React hook to close a menu when a click occurs outside of it.
// It listens for mouse events and updates the menu's open/close state accordingly.

import React, { SetStateAction, useEffect, RefObject } from "react";

type SingleRef = RefObject<HTMLElement | null>;
type MultiRef = { [key: string]: RefObject<HTMLElement | null> };
type ShowMenuRef = SingleRef | MultiRef;

interface CloseMenuOnOutsideClickProps {
  showMenu: boolean;
  showMenuRef: ShowMenuRef;
  setShowMenu: React.Dispatch<SetStateAction<boolean>>;
}

// Custom React hook to close a menu when clicking outside its referenced element.
export const useCloseMenuWhenClickedOutside = ({
  showMenu,
  showMenuRef,
  setShowMenu,
}: CloseMenuOnOutsideClickProps) => {
  useEffect(() => {
    // Handler to check if a click is outside the menu element.
    const checkIfClickedOutside = (e: MouseEvent) => {
      if (!showMenu) return;

      // If it's a single ref
      if ("current" in showMenuRef) {
        const el = showMenuRef.current;
        if (el instanceof HTMLElement && !el.contains(e.target as Node)) {
          setShowMenu(false);
        }
      } else {
        // It's an object of refs
        const refs = Object.values(showMenuRef);
        const isOutside = refs.every(
          ref =>
            ref.current instanceof HTMLElement &&
            !ref.current.contains(e.target as Node),
        );
        if (refs.length > 0 && isOutside) {
          setShowMenu(false);
        }
      }
    };

    // Add event listener for mouse down events.
    document.addEventListener("mousedown", checkIfClickedOutside);

    // Cleanup event listener on unmount.
    return () => {
      document.removeEventListener("mousedown", checkIfClickedOutside);
    };
  }, [setShowMenu, showMenu, showMenuRef]);
};
