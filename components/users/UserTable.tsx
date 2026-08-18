import React, { useEffect, useState } from "react";
import { UserHistoryProps, UserProps } from "@/types";
import { formatError, formatTimestampToDateTwo, getUserActions } from "@/utils";
import Image from "next/image";
import {
  Table,
  Pagination,
  Dropdown,
  LoadingState,
  TableColumnActions,
} from "@/common";
import { useFetchHook } from "@/hooks";
import { useClaims } from "@/context";
import { User2 } from "lucide-react";

import {
  API_BASE_URL,
  DEFAULT_SORT_OPTIONS_TWO,
  getStatusBgColor,
  getStatusBorderColor,
  getStatusColor,
} from "@/constants";

const UserTable = () => {
  const { token } = useClaims();

  const itemsPerPage = 50;
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [usersHistory, setUsersHistory] = useState<UserProps[]>([]);
  const [selectedSort, setSelectedSort] = useState<string>(
    DEFAULT_SORT_OPTIONS_TWO[0],
  );

  const handleSortSelection = (sort: string) => {
    setSelectedSort(sort);
  };

  const {
    data: usersData,
    isFetching,
    error: fetchError,
  } = useFetchHook<UserHistoryProps>({
    endpoint: `${API_BASE_URL}/v1/admin/users?skip=${(currentPage - 1) * itemsPerPage}&take=${itemsPerPage}&sort=${selectedSort}`,
    enabled: !!token && !!currentPage && !!itemsPerPage && !!selectedSort,
  });

  useEffect(() => {
    if (usersData) {
      setUsersHistory(usersData?.data);
      setTotalPages(Math.ceil(usersData?.totalCount / itemsPerPage));
    }
  }, [usersData]);

  // Pagination actions
  const handlePrevPage = () => {
    if (currentPage > 1) setCurrentPage(prev => prev - 1);
  };

  const handleNextPage = () => {
    if (currentPage < totalPages) setCurrentPage(prev => prev + 1);
  };

  const handleContactUser = React.useCallback((email: string) => {
    // open email app and send email
    window.open(`mailto:${email}`);
  }, []);

  // Map admins to table data
  const tableData = React.useMemo(
    () =>
      usersHistory?.map(user => {
        const actions = getUserActions({
          onContact: () => handleContactUser(user.email),
        }).items;
        const formattedJoinedDate = user?.joinedOn
          ? formatTimestampToDateTwo(user?.joinedOn)
          : "N/A";
        return {
          joinedOn: (
            <div className="px-6 py-2">
              <span className="text-body-medium-14 mb-1 block">
                {formattedJoinedDate}
              </span>
            </div>
          ),
          name: (
            <div className="flex items-center px-6">
              <div className="border-primary-200 bg-primary-50 text-primary-300 inline-flex aspect-square h-9 min-w-9 items-center justify-center overflow-hidden rounded-full border">
                {user?.avatar ? (
                  <Image
                    src={user?.avatar}
                    alt={user?.name}
                    width={36}
                    height={36}
                    className={`aspect-square size-9 object-cover`}
                  />
                ) : (
                  <User2 className="size-6" />
                )}
              </div>
              {user?.name ? (
                <h2 className="text-body-semibold-14 ml-1.5">{user?.name}</h2>
              ) : (
                <h2 className="text-body-semibold-14 ml-1.5 text-neutral-500">
                  {"<No Name>"}
                </h2>
              )}
            </div>
          ),
          email: (
            <div className="px-6 py-2">
              <span className="text-body-medium-14 mb-1 block">
                {user?.email}
              </span>
            </div>
          ),
          currentPlan: (
            <div className="px-6 py-2">
              {user?.currentPlan ? (
                <span
                  className={`inline-flex items-center rounded-lg border p-6 px-2.5 py-0.5 text-xs font-medium ${getStatusColor(
                    user?.currentPlan || "",
                  )} ${getStatusBgColor(
                    user?.currentPlan || "",
                  )} ${getStatusBorderColor(user?.currentPlan || "")}`}
                >
                  {user?.currentPlan}
                </span>
              ) : (
                <span className="mb-1 block text-xs font-medium text-black italic">
                  {"No Subscription"}
                </span>
              )}
            </div>
          ),
          noOfProjectsCreated: (
            <div className="px-6 py-2">
              {user?.noOfProjectsCreated !== undefined ? (
                <span className="text-body-medium-14 mb-1 block">
                  {user?.noOfProjectsCreated}
                </span>
              ) : (
                <span className="text-body-medium-14 mb-1 block text-neutral-500 italic">
                  {"<No Projects Created>"}
                </span>
              )}
            </div>
          ),
          actions: <TableColumnActions actions={{ items: actions }} />,
        };
      }),
    [usersHistory, handleContactUser],
  );

  // Table columns
  const columns = [
    { key: "joinedOn", label: "Joined on" },
    { key: "name", label: "Name" },
    { key: "email", label: "Email" },
    { key: "currentPlan", label: "Current plan" },
    { key: "noOfProjectsCreated", label: "Projects created" },
    { key: "actions", label: "Actions" },
  ];

  return (
    <>
      {isFetching && <LoadingState />}

      <main className="space-y-6">
        <div className="dashboard-layout space-y-8 bg-white p-6">
          <div
            className={`text-body-semibold-16 flex flex-1 flex-wrap items-center justify-between gap-x-2 gap-y-4`}
          >
            <div className="sm:ml-auto">
              <Dropdown
                label={`Sort By: ${selectedSort?.replace(/_/g, " ")}`}
                options={DEFAULT_SORT_OPTIONS_TWO}
                selectedOption={selectedSort}
                onSelect={handleSortSelection}
              />
            </div>
          </div>

          {usersHistory && usersHistory?.length > 0 ? (
            <div className="space-y-1">
              <Table columns={columns} data={tableData} />
              <Pagination
                currentPage={currentPage}
                itemsPerPage={itemsPerPage}
                totalPages={totalPages}
                totalItems={usersData?.totalCount || 0}
                handleNextPage={handleNextPage}
                handlePrevPage={handlePrevPage}
                setCurrentPage={setCurrentPage}
              />
            </div>
          ) : fetchError ? (
            <div className="flex items-center justify-center">
              <p className="text-body-semibold-14 text-red-500">
                {formatError(fetchError, "Error fetching users")}
              </p>
            </div>
          ) : (
            <div className="flex items-center justify-center">
              <p className="text-body-semibold-14 text-neutral-500">
                No users found.
              </p>
            </div>
          )}
        </div>
      </main>
    </>
  );
};

export default UserTable;
