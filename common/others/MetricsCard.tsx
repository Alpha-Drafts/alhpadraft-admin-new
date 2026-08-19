import { MetricsCardProps } from "@/types";
import { Info } from "lucide-react";
import { useRouter } from "next/router";
import React, { useState, useRef, useEffect } from "react";

export const MetricsCard = ({
  title,
  value,
  subValue,
  icon,
  tooltipText,
  link,
}: MetricsCardProps) => {
  const router = useRouter();
  const [showTooltip, setShowTooltip] = useState(false);
  const [tooltipPosition, setTooltipPosition] = useState<
    "center" | "left" | "right"
  >("center");
  const iconRef = useRef<HTMLButtonElement>(null);
  const tooltipRef = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    if (showTooltip && iconRef.current && tooltipRef.current) {
      const iconRect = iconRef.current.getBoundingClientRect();
      const viewportWidth = window.innerWidth;

      const tooltipWidth = tooltipRef.current.offsetWidth;
      const margin = 16;
      const iconCenter = iconRect.left + iconRect.width / 2;

      if (iconCenter - tooltipWidth / 2 < margin) {
        setTooltipPosition("left");
      } else if (
        iconCenter + tooltipWidth / 2 >
        viewportWidth - margin
      ) {
        setTooltipPosition("right");
      } else {
        setTooltipPosition("center");
      }
    }
  }, [showTooltip]);

  const getTooltipClasses = () => {
    const baseClasses =
      "bg-primary-600 absolute bottom-full z-[9999] mb-2 w-[260px] max-w-[90vw] rounded-md px-3 py-2 text-sm text-white shadow-lg transition-all duration-300 ease-in-out";

    const positionClasses = {
      center: "left-1/2 -translate-x-1/2",
      left: "left-0",
      right: "right-0",
    };

    const visibilityClasses = showTooltip
      ? "pointer-events-auto translate-y-0 opacity-100"
      : "pointer-events-none translate-y-2 opacity-0";

    return `${baseClasses} ${positionClasses[tooltipPosition]} ${visibilityClasses}`;
  };

  const getArrowClasses = () => {
    const baseClasses =
      "bg-primary-600 absolute top-full h-2 w-2 rotate-45 transform";

    const positionClasses = {
      center: "left-1/2 -translate-x-1/2",
      left: "left-4",
      right: "right-4",
    };

    return `${baseClasses} ${positionClasses[tooltipPosition]}`;
  };

  const cardContent = (
    <>
      <div className="bg-primary-50 text-primary-500 w-fit rounded-full p-2 text-2xl">
        {icon}
      </div>

      <div className="relative space-y-2">
        <div className="flex gap-2">
          <h2 className="text-body-semibold-14 text-neutral-700 uppercase">
            {title}
          </h2>

          {tooltipText && (
            <div className="relative">
              <button
                ref={iconRef}
                type="button"
                className="inline-flex cursor-pointer items-center justify-center border-none bg-transparent p-0"
                onMouseEnter={() => setShowTooltip(true)}
                onMouseLeave={() => setShowTooltip(false)}
                aria-label="Show info"
              >
                <Info size={20} className="text-primary-300" />
              </button>

              <span
                ref={tooltipRef}
                className={getTooltipClasses()}
                style={{
                  boxShadow: "0 4px 16px rgba(0,0,0,0.10)",
                  whiteSpace: "pre-line",
                }}
              >
                {tooltipText}

                <div
                  className={getArrowClasses()}
                  style={{ marginTop: "-4px" }}
                />
              </span>
            </div>
          )}
        </div>

        <p className="flex items-center justify-start gap-2">
          <span className="text-primary-600 text-2xl font-semibold">
            {value}
          </span>

          {subValue && (
            <span className="text-body-semibold-14 text-primary-500 flex gap-1">
              ({subValue})
            </span>
          )}
        </p>
      </div>
    </>
  );

  return link ? (
    <button
      onClick={() => router.push(link)}
      className="hover:bg-primary-50 hover:ring-primary-200 focus:ring-primary-200 relative w-full space-y-8 border border-transparent bg-white p-8 text-left shadow-lg transition-colors hover:ring-2 focus:ring-2 focus:outline-none"
    >
      {cardContent}
    </button>
  ) : (
    <div className="relative space-y-8 bg-white p-8 shadow-lg">
      {cardContent}
    </div>
  );
};
