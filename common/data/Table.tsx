import { Link } from "lucide-react";
import React from "react";
import { TableProps } from "@/types";

/**
 * A reusable table component that supports custom columns and data
 * @param {Array} columns - Array of column definitions with keys and labels
 * @param {Array} data - Array of objects containing row data
 */
export const Table = ({ columns, data }: TableProps) => {
  return (
    <div id="items" className="overflow-x-auto pb-10">
      {/* Table header */}
      <table className="min-w-full divide-y divide-neutral-200 bg-neutral-50">
        {/* Column headers */}
        <thead className="">
          <tr>
            {columns?.map(column => (
              <th
                key={column?.key}
                scope="col"
                className="px-6 py-3 text-start"
              >
                <span className="text-body-bold-12 whitespace-nowrap text-[#6B7280] uppercase dark:text-neutral-200">
                  {column?.label}
                </span>
              </th>
            ))}
          </tr>
        </thead>

        {/* Table body */}
        <tbody className="">
          {/* Render rows with special handling for actions and description columns */}
          {data.map((row, rowIndex) => (
            <tr key={rowIndex} className="hover:bg-neutral-50">
              {columns?.map(column =>
                column?.key === "actions" ? (
                  // For the actions column we assume the row already contains the JSX element.
                  row[column?.key]
                ) : column?.key === "description" ? (
                  <td key={column?.key} className="h-px w-72 min-w-72">
                    {row?.url ? (
                      <Link
                        className="relative z-10 block"
                        href={row?.url || "#"}
                      >
                        {row[column?.key]}
                      </Link>
                    ) : (
                      row[column?.key]
                    )}
                  </td>
                ) : (
                  <td key={column?.key} className="size-px whitespace-nowrap">
                    {row?.url ? (
                      <Link
                        className="relative z-10 block"
                        href={row?.url || "#"}
                      >
                        {row[column?.key]}
                      </Link>
                    ) : (
                      row[column?.key]
                    )}
                  </td>
                ),
              )}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};
