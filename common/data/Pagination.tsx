import { PaginationProps } from "@/types";
import React from "react";

/**
 * A pagination component with dynamic page number display
 * @param {number} currentPage - Current active page
 * @param {number} itemsPerPage - Number of items displayed per page
 * @param {number} totalPages - Total number of pages
 * @param {number} totalItems - Total number of items
 * @param {Function} handleNextPage - Handler for next page button
 * @param {Function} handlePrevPage - Handler for previous page button
 * @param {Function} setCurrentPage - Function to set current page
 * @param {boolean} hideText - Option to hide the items count text
 */
export const Pagination = ({
  currentPage,
  itemsPerPage,
  totalPages,
  totalItems,
  handleNextPage,
  handlePrevPage,
  setCurrentPage,
  hideText,
}: PaginationProps) => {
  /**
   * Handles page selection and scrolls to top of items
   * @param {number} page - Page number to navigate to
   */
  const handlePageSelect = (page: number) => {
    // scroll to top of the page #items
    const itemsSection = document.getElementById("items");
    if (itemsSection) {
      itemsSection.scrollIntoView({ behavior: "smooth" });
    }
    setCurrentPage(page);
  };

  // Early return if no items to paginate
  if (totalItems === 0) {
    return null; // No pagination needed if there are no items
  }

  return (
    <div className="grid gap-4 lg:flex lg:items-center lg:justify-between">
      {!hideText && (
        <div className="flex items-center gap-2 text-sm text-black">
          <p className="text-body-semibold-14">
            {`Showing ${(currentPage - 1) * itemsPerPage + 1}-${Math.min(
              currentPage * itemsPerPage,
              totalItems,
            )} of ${totalItems} items`}
          </p>
        </div>
      )}

      <div className="flex flex-wrap items-center gap-4">
        <button
          onClick={handlePrevPage}
          disabled={currentPage === 1}
          className="border-primary-600 text-body-bold-14 text-primary-600 hover:bg-primary-50 focus:bg-primary-50 inline-flex items-center justify-center rounded-full border-2 px-4 py-2 shadow-sm focus:outline-none disabled:pointer-events-none disabled:opacity-50"
        >
          Prev
        </button>

        {/* Page Number Buttons */}
        <div className="flex items-center gap-x-1">
          {(() => {
            // Always show max 5 elements (buttons + ellipsis) at a time
            let pages: (number | "...")[] = [];
            if (totalPages <= 5) {
              pages = Array.from({ length: totalPages }, (_, i) => i + 1);
            } else if (currentPage <= 3) {
              // Show first 4 pages, ellipsis, last page
              pages = [1, 2, 3, 4, "..."];
            } else if (currentPage >= totalPages - 2) {
              // Show first page, ellipsis, last 4 pages
              pages = [
                1,
                "...",
                totalPages - 3,
                totalPages - 2,
                totalPages - 1,
                totalPages,
              ];
              pages = pages.slice(-5);
            } else {
              // Show first page, ellipsis, current, next, ellipsis
              pages = [1, "...", currentPage, currentPage + 1, "..."];
            }
            return pages.map((page, index) =>
              page === "..." ? (
                <span
                  key={`ellipsis-${index}`}
                  className="border-primary-400 text-body-bold-14 text-primary-800 hover:bg-primary-50 inline-flex h-9 w-9 items-center justify-center rounded-full border-2 bg-white px-2 shadow-sm focus:outline-none"
                >
                  ...
                </span>
              ) : (
                <button
                  key={page}
                  type="button"
                  onClick={() => handlePageSelect(page)}
                  disabled={currentPage === page}
                  className={`border-primary-400 text-body-bold-14 inline-flex h-9 w-9 items-center justify-center rounded-full border-2 px-2 shadow-sm focus:outline-none ${
                    currentPage === page
                      ? "bg-primary-600 text-white"
                      : "text-primary-800 hover:bg-primary-50 bg-white"
                  }`}
                  aria-current={currentPage === page ? "page" : undefined}
                >
                  {page}
                </button>
              ),
            );
          })()}
        </div>

        {/* Next Button */}
        <button
          onClick={handleNextPage}
          disabled={currentPage === totalPages}
          className="border-primary-600 text-body-bold-14 text-primary-600 hover:bg-primary-50 focus:bg-primary-50 inline-flex items-center justify-center rounded-full border-2 px-4 py-2 shadow-sm focus:outline-none disabled:pointer-events-none disabled:opacity-50"
        >
          Next
        </button>
      </div>
    </div>
  );
};
