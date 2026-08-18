// This file provides a custom React hook for horizontal scrolling of a referenced div element.
// It enables smooth left/right scrolling by a specified width and gap.

import { useRef } from "react";

const useScroll = (width: number, gap: number) => {
  // Reference to the scrollable div element
  const slideRef = useRef<HTMLDivElement>(null);

  // Function to scroll the div left or right by the specified amount
  const scroll = (direction: "left" | "right") => {
    if (slideRef.current) {
      const scrollAmount = width + gap;
      slideRef.current.scrollBy({
        left: direction === "left" ? -scrollAmount : scrollAmount,
        behavior: "smooth",
      });
    }
  };

  // Returns the ref and scroll function for use in components
  return { slideRef, scroll };
};

export default useScroll;
