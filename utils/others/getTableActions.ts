import { TableActionItem } from "@/types";

export const getAdminActions = (
  isSuperAdmin: boolean,
  actionHandlers: {
    onRemoveAdminDetails: () => void;
  },
): { items: TableActionItem[] } => {
  const items: TableActionItem[] = [];

  if (isSuperAdmin) {
    items.push({
      label: "Remove Admin",
      action: actionHandlers.onRemoveAdminDetails,
    });
  }

  return { items };
};

export const getUserActions = (actionHandlers: {
  // onViewDetails: () => void;
  onContact: () => void;
  // onDisable: () => void;
  // onDelete: () => void;
}): { items: TableActionItem[] } => {
  const items: TableActionItem[] = [];

  // items.push({
  //   label: "View Details",
  //   action: actionHandlers.onViewDetails,
  // });

  items.push({
    label: "Contact",
    action: actionHandlers.onContact,
  });

  // items.push({
  //   label: "Disable",
  //   action: actionHandlers.onDisable,
  // });

  // items.push({
  //   label: "Delete",
  //   action: actionHandlers.onDelete,
  // });

  return { items };
};

export const getSubscriptionActions = (actionHandlers: {
  onViewDetails?: () => void;
}): { items: TableActionItem[] } => {
  const items: TableActionItem[] = [];

  if (actionHandlers.onViewDetails) {
    items.push({
      label: "View Details",
      action: actionHandlers.onViewDetails,
    });
  }
  return { items };
};
