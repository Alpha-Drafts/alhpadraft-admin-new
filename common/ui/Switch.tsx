import React from "react";
import { SwitchProps } from "@/types";

export function Switch({
  name,
  offLabel,
  onLabel,
  status,
  disabled,
  setStatus,
}: SwitchProps) {
  return (
    <div className="flex items-center gap-2 text-sm font-medium text-[#191d23]">
      {offLabel}
      <label className="relative inline-block h-[24px] w-[42px]" htmlFor={name}>
        <input
          id={name}
          name={name}
          type="checkbox"
          checked={status}
          onChange={() => setStatus(!status)}
          disabled={disabled}
          className="peer sr-only"
        />
        <span
          className={`absolute top-0 right-0 bottom-0 left-0 rounded-full transition ${disabled ? "cursor-not-allowed bg-[#eeeeee]" : "bg-[#e7e7e7] peer-checked:bg-[#017a4b]"} peer-focus:ring-2 peer-focus:ring-[#017a4b]`}
        ></span>
        <span
          className={`absolute bottom-1 left-1 h-4 w-4 rounded-full bg-white transition-transform peer-checked:translate-x-[18px]`}
        ></span>
      </label>
      {onLabel}
    </div>
  );
}
