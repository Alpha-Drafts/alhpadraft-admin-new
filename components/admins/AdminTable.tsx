import React, { useEffect, useState } from "react";
import { AdminHistoryProps, AdminProps } from "@/types";
import {
  formatError,
  formatTimestampToDate,
  getAdminActions,
  apiClient,
} from "@/utils";
import Image from "next/image";
import {
  Table,
  Pagination,
  Dropdown,
  Modal,
  LoadingState,
  TableColumnActions,
} from "@/common";
import { useFetchHook } from "@/hooks";
import { useClaims } from "@/context";
import { toast } from "react-toastify";
import { Trash2, User2 } from "lucide-react";
import CreateAdminForm from "./CreateAdminForm";
import { DEFAULT_SORT_OPTIONS } from "@/constants";

const AdminTable = ({
  type,
  isSuperAdmin,
  refetchCount,
}: {
  type: "admin" | "super_admin";
  isSuperAdmin: boolean;
  refetchCount?: () => void;
}) => {
  const { token } = useClaims();

  const itemsPerPage = 50;
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [adminsHistory, setAdminsHistory] = useState<AdminProps[]>([]);
  const [selectedItem, setSelectedItem] = useState<AdminProps | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedSort, setSelectedSort] = useState<string>(
    DEFAULT_SORT_OPTIONS[0],
  );
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState("");
  const [inputValue, setInputValue] = useState("");
  const isDisabled = () => inputValue !== selectedItem?.email || isLoading;

  const handleSortSelection = (sort: string) => {
    setSelectedSort(sort);
  };

  const handleCloseDetailsModal = () => {
    setSelectedItem(null);
    setIsModalOpen(false);
  };

  const handleOpenRemoveModal = (tx: AdminProps) => {
    setSelectedItem(tx);
    setIsModalOpen(true);
    console.warn("Open Remove Admin modal with ID:", tx?.user_id);
  };

  const {
    data: adminsData,
    isFetching,
    error: fetchError,
    refetch: refetchAdmins,
  } = useFetchHook<AdminHistoryProps>({
    endpoint: `/api/v1/admins?skip=${(currentPage - 1) * itemsPerPage}&take=${itemsPerPage}&sort=${selectedSort}&type=${type}`,
    enabled:
      !!token && !!currentPage && !!itemsPerPage && !!selectedSort && !!type,
  });

  useEffect(() => {
    if (adminsData) {
      setAdminsHistory(adminsData?.data);
      setTotalPages(Math.ceil(adminsData?.total_count / itemsPerPage));
    }
  }, [adminsData]);

  // Pagination actions
  const handlePrevPage = () => {
    if (currentPage > 1) setCurrentPage(prev => prev - 1);
  };

  const handleNextPage = () => {
    if (currentPage < totalPages) setCurrentPage(prev => prev + 1);
  };

  const handleRemoveAdmin = async () => {
    if (!token || !inputValue) return;

    if (inputValue !== selectedItem?.email) {
      setError("Admin's email does not match");
      return;
    }

    if (isDisabled()) return;

    setIsLoading(true);
    try {
      const response = await apiClient.delete(`/api/v1/admins`, {
        params: {
          userId: selectedItem.user_id,
          role: type,
        },
      });

      if (response?.data?.status === "success") {
        toast.success(
          `${type === "super_admin" ? "Super admin" : "Admin"} removed successfully`,
        );
        refetchAdmins();
        if (refetchCount) refetchCount();
        setIsModalOpen(false);
      }
    } catch (error) {
      toast.error(formatError(error, "Error removing admin"));
    } finally {
      setInputValue("");
      setIsLoading(false);
    }
  };

  // Map admins to table data
  const mapItemsToTableData = () =>
    adminsHistory?.map(admin => {
      const actions = getAdminActions(isSuperAdmin, {
        onRemoveAdminDetails: () => handleOpenRemoveModal(admin),
      }).items;

      return {
        name: (
          <div className="flex items-center px-6">
            <div className="border-primary-100 bg-primary-50 inline-flex aspect-square h-9 min-w-9 items-center justify-center overflow-hidden rounded-full border text-neutral-800">
              {admin?.photo_url ? (
                <Image
                  src={admin?.photo_url}
                  alt={admin?.name}
                  width={36}
                  height={36}
                  className={`aspect-square size-9 object-cover`}
                />
              ) : (
                <User2 className="size-6" />
              )}
            </div>
            <h2 className="text-body-medium-14 ml-1.5 text-black">
              {admin?.name}
            </h2>
          </div>
        ),
        email: (
          <div className="px-6 py-2">
            <span className="text-body-medium-14 mb-1 block text-black">
              {admin?.email}
            </span>
          </div>
        ),
        ...(isSuperAdmin && {
          roles: (
            <p className="flex gap-2 px-6 py-2">
              {admin.roles?.map(
                role =>
                  (role === "admin" || role === "super_admin") && (
                    <span
                      key={role}
                      className="bg-primary-50 text-primary-700 rounded-full px-2.5 py-0.5 text-xs font-medium"
                    >
                      {role.trim().replace(/_/g, " ")}
                    </span>
                  ),
              )}
            </p>
          ),
        }),
        createdAt: (
          <div className="px-6 py-2">
            <span className="text-body-medium-14 mb-1 block text-black">
              {formatTimestampToDate(admin?.created_at)}
            </span>
          </div>
        ),
        actions: <TableColumnActions actions={{ items: actions }} />,
      };
    });

  // Table columns
  const columns = [
    { key: "createdAt", label: "Created At" },
    { key: "name", label: "Name" },
    { key: "email", label: "Email" },
    ...(isSuperAdmin ? [{ key: "roles", label: "Roles" }] : []),
    ...(isSuperAdmin ? [{ key: "actions", label: "Actions" }] : []),
  ];

  return (
    <>
      {isFetching && <LoadingState />}

      <main className="space-y-6">
        <div className="dashboard-layout space-y-8 bg-white p-6">
          <div
            className={`text-body-semibold-16 flex flex-1 flex-wrap items-center justify-between gap-x-2 gap-y-4`}
          >
            {isSuperAdmin ? (
              <CreateAdminForm
                refetchCount={() => {
                  if (refetchCount) refetchCount();
                  refetchAdmins();
                }}
              />
            ) : (
              <h2 className="text-heading-5">
                All {type === "admin" ? "Admins" : "Super Admins"}
              </h2>
            )}
            <div className="sm:ml-auto">
              <Dropdown
                label={`Sort By: ${selectedSort?.replace(/_/g, " ")}`}
                options={DEFAULT_SORT_OPTIONS}
                selectedOption={selectedSort}
                onSelect={handleSortSelection}
              />
            </div>
          </div>

          {adminsHistory && adminsHistory?.length > 0 ? (
            <div className="space-y-1">
              <Table columns={columns} data={mapItemsToTableData()} />
              <Pagination
                currentPage={currentPage}
                itemsPerPage={itemsPerPage}
                totalPages={totalPages}
                totalItems={adminsData?.total_count || 0}
                handleNextPage={handleNextPage}
                handlePrevPage={handlePrevPage}
                setCurrentPage={setCurrentPage}
              />
            </div>
          ) : fetchError ? (
            <div className="flex items-center justify-center">
              <p className="text-body-semibold-14 text-red-500">
                {formatError(fetchError, "Error fetching admins")}
              </p>
            </div>
          ) : (
            <div className="flex items-center justify-center">
              <p className="text-body-semibold-14 text-neutral-500">
                No admins found.
              </p>
            </div>
          )}
        </div>
      </main>

      {selectedItem && (
        <Modal
          isOpen={isModalOpen}
          title="Remove Admin"
          message={
            <>
              <p className="my-3 text-sm text-gray-500">
                Are you sure you want to remove this admin? This action cannot
                be undone. Please type in{" "}
                <span className="font-semibold text-red-600">
                  {selectedItem?.email}
                </span>{" "}
                to confirm.
              </p>
              <input
                type="text"
                placeholder="Type admin email"
                value={inputValue}
                onChange={e => {
                  setError("");
                  setInputValue(e.target.value);
                }}
                className="block w-full rounded-md border border-gray-300 px-4 py-2 text-gray-900 focus:ring focus:ring-indigo-500 focus:outline-none"
              />
              {error && <p className="mt-2 text-sm text-red-600">{error}</p>}
            </>
          }
          submitText="Remove Admin"
          onClose={handleCloseDetailsModal}
          onSubmit={handleRemoveAdmin}
          icon={<Trash2 size={32} className="text-red-600" />}
          iconStyle="!bg-red-50"
          cancelText="Cancel"
          onCancel={() => setIsModalOpen(false)}
        />
      )}
    </>
  );
};

export default AdminTable;
