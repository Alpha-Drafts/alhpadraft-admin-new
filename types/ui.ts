import React, { JSX, ReactNode } from "react";
import {
  BUTTON_TYPES,
  BUTTON_VARIANT_TYPES,
  DROPDOWN_VARIANT_TYPES,
  POSITION_TYPES,
} from "@/constants";

export type PositionType = (typeof POSITION_TYPES)[number];

export type DropdownVariantType = (typeof DROPDOWN_VARIANT_TYPES)[number];

export interface ModalProps {
  isOpen: boolean;
  icon: React.ReactNode;
  iconStyle?: string;
  title: string;
  message: string | ReactNode;
  submitText?: string;
  onSubmit?: () => void;
  cancelText?: string;
  onCancel?: () => void;
  onClose?: () => void;
  closeOnOverlayClick?: boolean;
  isProcessing?: boolean;
}

export interface BreadcrumbProps {
  name: string;
  href: string;
}

export interface TabItemProps {
  key: string;
  title: string | ReactNode;
  icon?: ReactNode;
  content: ReactNode;
}

export interface TabProps {
  tabs: TabItemProps[];
  className?: string;
  queryParam?: string;
}

export interface DropdownProps {
  label: string;
  options: string[];
  selectedOption: string;
  onSelect: (option: string) => void;
  variant?: DropdownVariantType;
  className?: string;
}

export type ButtonType = (typeof BUTTON_TYPES)[number];

export type ButtonVariantType = (typeof BUTTON_VARIANT_TYPES)[number];

export interface ButtonProps {
  text?: string;
  id?: string;
  type?: ButtonType;
  className?: string;
  onClick?: (e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => void;
  disabled?: boolean;
  hidden?: boolean;
  children?: React.ReactNode;
  link?: string;
  title?: string;
  icon?: React.ReactNode;
  iconPosition?: PositionType;
  variant?: ButtonVariantType;
  size?: "sm" | "md" | "lg";
  rounded?: "sm" | "md" | "lg" | "full";
  [key: string]: unknown; // Allow additional props for flexibility
}

export interface NavItemProps {
  name: string;
  href: string;
  isActive: boolean;
  icon?: React.ReactNode;
  title?: string;
  subLinks?: NavItemProps[];
}

export interface SwitchProps {
  name: string;
  offLabel?: string;
  onLabel?: string;
  status: boolean;
  disabled?: boolean;
  setStatus: (tab: boolean) => void;
}

export interface MetricsCardProps {
  title: string;
  value: string;
  icon: JSX.Element;
  subValue?: string;
  link?: string;
  tooltipText?: string;
}
