import React, { useEffect, useState } from "react";
import { Table, Pagination, LoadingState, Dropdown } from "@/common";
import { useFetchHook } from "@/hooks";
import { useClaims } from "@/context";
import { toast } from "react-toastify";
import { formatPrices, formatTimestampToDateTwo } from "@/utils";
import { Subscription, SubscriptionResponse } from "@/types/subscriptions";
import {
  API_BASE_URL,
  getStatusBgColor,
  getStatusBorderColor,
  getStatusColor,
  PLANS,
  SUBSCRIPTION_STATUSES,
} from "@/constants";

function normalSubscriptionData(data: SubscriptionResponse | undefined): {
  items: Subscription[];
  total: number;
} {
  if (!data || !Array.isArray(data.data)) return { items: [], total: 0 };

  return { items: data.data, total: data.totalCount ?? data.data.length };
}

const SubscriptionTable = () => {
  const { token } = useClaims();
  const itemsPerPage = 50;
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalItems, setTotalItems] = useState(0);
  const [subscriptions, setSubscriptions] = useState<Subscription[]>([]);
  const [selectedSort, setSelectedSort] = useState<string>("all");
  const [selectedStatus, setSelectedStatus] = useState<string>("all");

  const handleSortSelection = (sort: string) => {
    setSelectedSort(sort);
  };

  const handleStatusSelection = (status: string) => {
    setSelectedStatus(status);
  };

  const planQuery = selectedSort === "all" ? "" : `name=${selectedSort}&`;
  const statusQuery =
    selectedStatus === "all" ? "" : `status=${selectedStatus}&`;

  const {
    data: subscriptionsData,
    isFetching,
    error: fetchError,
  } = useFetchHook<SubscriptionResponse>({
    endpoint: `${API_BASE_URL}/v1/admin/subscriptions?skip=${(currentPage - 1) * itemsPerPage}&take=${itemsPerPage}&${planQuery}${statusQuery}order=desc`,
    enabled: !!token,
  });

  useEffect(() => {
    const { items, total } = normalSubscriptionData(subscriptionsData);
    setSubscriptions(items);
    setTotalItems(total);
    setTotalPages(Math.max(1, Math.ceil(total / itemsPerPage)));
  }, [subscriptionsData]);

  useEffect(() => {
    if (fetchError) {
      toast.error(fetchError.message);
    }
  }, [fetchError]);

  // Handle pagination
  const handlePrevPage = () => {
    if (currentPage > 1) setCurrentPage(prev => prev - 1);
  };

  const handleNextPage = () => {
    if (currentPage < totalPages) setCurrentPage(prev => prev + 1);
  };

  // Map subscription data to table rows
  const mapItemsToTableData = () => {
    if (!subscriptions || subscriptions.length === 0) return [];

    return subscriptions.map(sub => {
      const formattedDate = sub?.paymentDate
        ? formatTimestampToDateTwo(sub?.paymentDate)
        : "N/A";

      const subId = sub.id;

      return {
        id: subId,
        date: (
          <div className="px-6 py-2">
            <span className="text-body-medium-14 text-black">
              {formattedDate}
            </span>
          </div>
        ),
        plan: (
          <div className="px-6 py-2">
            {sub.planName ? (
              <span
                className={`inline-flex items-center rounded-lg border p-6 px-2.5 py-0.5 text-xs font-medium ${getStatusColor(
                  sub?.planName || "",
                )} ${getStatusBgColor(
                  sub?.planName || "",
                )} ${getStatusBorderColor(sub?.planName || "")}`}
              >
                {sub.planName}
              </span>
            ) : (
              <span className="mb-1 block text-xs font-medium text-black italic">
                {"No Subscription"}
              </span>
            )}
          </div>
        ),
        amount: (
          <div className="px-6 py-2">
            <span className="text-body-medium-14 text-black">
              {formatPrices(Number(sub.amountPaid), "USD")}
            </span>
          </div>
        ),

        status: (
          <div className="px-6 py-2">
            <span
              className={`inline-flex items-center rounded-lg border px-2.5 py-0.5 text-xs font-medium ${getStatusColor(sub.status)} ${getStatusBgColor(sub.status)} ${getStatusBorderColor(sub.status)}`}
            >
              {sub.status}
            </span>
          </div>
        ),
      };
    });
  };

  // Table columns
  const columns = [
    { key: "date", label: "Payment Date" },
    { key: "plan", label: "Plan Name" },
    { key: "amount", label: "Amount Paid" },
    { key: "status", label: "Status" },
  ];

  const tableData = mapItemsToTableData();

  return (
    <div className="w-full">
      {isFetching ? (
        <LoadingState />
      ) : (
        <>
          <div className="dashboard-layout space-y-8 bg-white p-6">
            <div
              className={`text-body-semibold-16 flex flex-1 flex-wrap items-center justify-between gap-x-2 gap-y-4`}
            >
              <h2 className="text-heading-5">All Subcriptions</h2>
              <div className="flex flex-wrap gap-4">
                <Dropdown
                  label={`Plan: ${selectedSort?.replace(/_/g, " ")}`}
                  options={["all", ...PLANS]}
                  selectedOption={selectedSort}
                  onSelect={handleSortSelection}
                />
                <Dropdown
                  label={`Status: ${selectedStatus?.replace(/_/g, " ")}`}
                  options={["all", ...SUBSCRIPTION_STATUSES]}
                  selectedOption={selectedStatus}
                  onSelect={handleStatusSelection}
                />
              </div>
            </div>
            <Table columns={columns} data={tableData} />
          </div>

          <div className="space-y-1">
            <Pagination
              currentPage={currentPage}
              totalPages={totalPages}
              totalItems={totalItems}
              itemsPerPage={itemsPerPage}
              handlePrevPage={handlePrevPage}
              handleNextPage={handleNextPage}
              setCurrentPage={setCurrentPage}
            />
          </div>
        </>
      )}
    </div>
  );
};

export default SubscriptionTable;
