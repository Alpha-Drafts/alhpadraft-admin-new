import React, { useRef, useEffect, useState } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { useRouter } from "next/router";
import { PositionType, TabProps } from "@/types";

/**
 * A responsive tab component with horizontal scrolling capabilities
 * @param {Array} tabs - Array of tab objects containing key, title, icon, and content
 * @param {string} className - Additional CSS classes for styling
 * @param {string} queryParam - URL query parameter to sync active tab with URL
 */
export const Tab = ({ tabs, className = "", queryParam }: TabProps) => {
  const router = useRouter();
  const { query } = router;

  // Track the currently active tab
  const [activeTab, setActiveTab] = useState(tabs[0].key);

  // Reference for the tabs container to handle scrolling
  const tabsRef = useRef<HTMLDivElement>(null);
  // State to control visibility of scroll buttons
  const [showScrollButtons, setShowScrollButtons] = useState(false);

  // Sync active tab with URL query parameter if provided
  useEffect(() => {
    if (queryParam && query[queryParam]) {
      const tabKey = query[queryParam] as string;
      if (tabs.some(tab => tab?.key === tabKey)) {
        setActiveTab(tabKey);
      }
    }
  }, [query, queryParam, tabs]);

  // Check if tabs container needs scroll buttons
  useEffect(() => {
    const checkOverflow = () => {
      if (tabsRef.current) {
        const { scrollWidth, clientWidth } = tabsRef.current;
        setShowScrollButtons(scrollWidth > clientWidth);
      }
    };

    checkOverflow();
    window.addEventListener("resize", checkOverflow);
    return () => window.removeEventListener("resize", checkOverflow);
  }, [tabs]);

  /**
   * Handle horizontal scrolling of tabs
   * @param {"left" | "right"} direction - Scroll direction
   */
  const scroll = (direction: PositionType) => {
    if (tabsRef.current) {
      const scrollAmount = 200;
      tabsRef.current.scrollBy({
        left: direction === "left" ? -scrollAmount : scrollAmount,
        behavior: "smooth",
      });
    }
  };

  return (
    <div className="flex w-full flex-col gap-4 overflow-x-auto">
      <nav className={`relative w-full ${className}`}>
        {/* Left scroll button */}
        {showScrollButtons && (
          <button
            onClick={() => scroll("left")}
            className="absolute top-1/2 left-0 z-10 -translate-y-1/2 rounded-full bg-white/80 p-1 shadow-md"
            aria-label="Scroll left"
          >
            <ChevronLeft size="24" />
          </button>
        )}

        {/* Tabs container */}
        <div
          ref={tabsRef}
          className="scrollbar-hide flex justify-start gap-6 overflow-x-auto border-b border-b-neutral-200"
          style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
        >
          {/* Individual tab buttons */}
          {tabs.map(tab => (
            <button
              key={tab?.key}
              type="button"
              onClick={() => setActiveTab(tab?.key)}
              className={`group text-body-semibold-16 flex items-center gap-2 border-b-4 p-2.5 whitespace-nowrap transition-colors ${
                activeTab === tab?.key
                  ? "border-b-primary-600 text-black"
                  : "border-b-transparent text-neutral-800"
              }`}
            >
              {tab?.icon && tab?.icon}
              <span className="text-center font-semibold">{tab?.title}</span>
            </button>
          ))}
        </div>

        {/* Right scroll button */}
        {showScrollButtons && (
          <button
            onClick={() => scroll("right")}
            className="absolute top-1/2 right-0 z-10 -translate-y-1/2 rounded-full bg-white/80 p-1 shadow-md"
            aria-label="Scroll right"
          >
            <ChevronRight size="24" />
          </button>
        )}
      </nav>

      {/* Active tab content */}
      {tabs.find(tab => tab?.key === activeTab)?.content}
    </div>
  );
};
