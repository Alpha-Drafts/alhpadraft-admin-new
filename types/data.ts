import { TABLE_ACTION_TYPES } from "@/constants";
import React, { ReactNode } from "react";

export type TableActionType = (typeof TABLE_ACTION_TYPES)[number];

export interface TableActionItem {
  label: string;
  action: () => void;
  variant?: TableActionType;
}

export interface TableColumnActionsProps {
  icon?: React.ElementType;
  items: TableActionItem[];
}

export interface TableProps {
  columns: {
    key: string;
    label: string;
  }[];
  data: {
    [key: string]: ReactNode;
    url?: string;
  }[];
}

export interface PaginationProps {
  currentPage: number;
  itemsPerPage: number;
  totalPages: number;
  totalItems: number;
  handleNextPage: () => void;
  handlePrevPage: () => void;
  setCurrentPage: (page: number) => void;
  hideText?: boolean;
}
