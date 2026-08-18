import { useEffect } from "react";

// Currently not in use
export const useInitPreline = () => {
  useEffect(() => {
    // @ts-expect-error - HSDropdown comes from the Preline UI library
    const HSDropdown = window.HSDropdown;
    // @ts-expect-error - HSOverlay comes from the Preline UI library
    const HSOverlay = window.HSOverlay;
    // @ts-expect-error - HSAccordion comes from the Preline UI library
    const HSAccordion = window.HSAccordion;

    if (HSDropdown) {
      HSDropdown.autoInit();
    }

    if (HSOverlay) {
      HSOverlay.autoInit();
    }

    if (HSAccordion) {
      HSAccordion.autoInit();
    }

    return () => {
      if (HSDropdown) {
        // Cleanup dropdowns when component unmounts
        document.querySelectorAll(".hs-dropdown").forEach(dropdown => {
          // Changed from hide to close
          HSDropdown.close(dropdown);
        });
      }

      if (HSOverlay) {
        // Cleanup overlays when component unmounts
        document.querySelectorAll(".hs-overlay").forEach(overlay => {
          HSOverlay.close(overlay);
        });
      }

      if (HSAccordion) {
        // Cleanup accordions when component unmounts
        document.querySelectorAll(".hs-accordion").forEach(accordion => {
          HSAccordion.close(accordion);
        });
      }
    };
  }, []);
};
