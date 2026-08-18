import React, { useEffect, useState } from "react";
import { ProjectHistoryProps, ProjectProps } from "@/types";
import {
  formatError,
  formatTimestampToDateTwo,
  getSubscriptionActions,
} from "@/utils";
import {
  Table,
  Pagination,
  Dropdown,
  LoadingState,
  TableColumnActions,
} from "@/common";
import { useFetchHook } from "@/hooks";
import { useClaims } from "@/context";

import {
  API_BASE_URL,
  getStatusBgColor,
  getStatusBorderColor,
  getStatusColor,
  PROJECT_STATUS_OPTIONS,
} from "@/constants";

const ProjectTable = () => {
  const { token } = useClaims();

  const statuses = ["All", ...PROJECT_STATUS_OPTIONS];

  const itemsPerPage = 50;
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [projectsHistory, setProjectsHistory] = useState<ProjectProps[]>([]);
  const [selectedStatus, setSelectedStatus] = useState<string>(statuses[0]);

  const handleSortSelection = (sort: string) => {
    setSelectedStatus(sort);
  };

  const {
    data: projectsData,
    isFetching,
    error: fetchError,
  } = useFetchHook<ProjectHistoryProps>({
    endpoint: `${API_BASE_URL}/v1/admin/projects?skip=${(currentPage - 1) * itemsPerPage}&take=${itemsPerPage}&status=${selectedStatus}`,
    enabled: !!token && !!currentPage && !!itemsPerPage && !!selectedStatus,
  });

  useEffect(() => {
    if (projectsData) {
      setProjectsHistory(projectsData?.data);
      setTotalPages(Math.ceil(projectsData?.totalCount / itemsPerPage));
    }
  }, [projectsData]);

  // Pagination actions
  const handlePrevPage = () => {
    if (currentPage > 1) setCurrentPage(prev => prev - 1);
  };

  const handleNextPage = () => {
    if (currentPage < totalPages) setCurrentPage(prev => prev + 1);
  };

  // Map admins to table data
  const tableData = React.useMemo(
    () =>
      projectsHistory?.map(project => {
        const actions = getSubscriptionActions({
          // onViewDetails: () => handleViewProjectDetails(project.id),
        }).items;
        return {
          name: (
            <div className="flex items-center px-6">
              <h2 className="text-body-medium-14 ml-1.5 text-black">
                {project?.name}
              </h2>
            </div>
          ),
          creator: (
            <div className="px-6 py-2">
              <span className="text-body-medium-14 mb-1 block text-black">
                {project?.creatorName}
              </span>
            </div>
          ),
          status: (
            <div className="px-6 py-2">
              <span
                className={`inline-flex items-center rounded-lg border p-6 px-2.5 py-0.5 text-xs font-medium ${getStatusColor(project.status ?? "")} ${getStatusBgColor(project.status ?? "")} ${getStatusBorderColor(project.status ?? "")}`}
              >
                {project.status
                  ? project.status.replace(/_/g, " ")
                  : "No status"}
              </span>
            </div>
          ),
          createdAt: (
            <div className="px-6 py-2">
              <span className="text-body-medium-14 mb-1 block text-black">
                {project?.createdAt
                  ? formatTimestampToDateTwo(project?.createdAt)
                  : "N/A"}
              </span>
            </div>
          ),
          actions: <TableColumnActions actions={{ items: actions }} />,
        };
      }),
    [projectsHistory],
  );

  // Table columns
  const columns = [
    { key: "createdAt", label: "Created At" },
    { key: "name", label: "Project Name" },
    { key: "creator", label: "Creator Name" },
    { key: "status", label: "Status" },
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
                label={`Sort By: ${selectedStatus?.replace(/_/g, " ")}`}
                options={statuses}
                selectedOption={selectedStatus}
                onSelect={handleSortSelection}
              />
            </div>
          </div>

          {projectsHistory && projectsHistory?.length > 0 ? (
            <div className="space-y-1">
              <Table columns={columns} data={tableData} />
              <Pagination
                currentPage={currentPage}
                itemsPerPage={itemsPerPage}
                totalPages={totalPages}
                totalItems={projectsData?.totalCount || 0}
                handleNextPage={handleNextPage}
                handlePrevPage={handlePrevPage}
                setCurrentPage={setCurrentPage}
              />
            </div>
          ) : fetchError ? (
            <div className="flex items-center justify-center">
              <p className="text-body-semibold-14 text-red-500">
                {formatError(fetchError, "Error fetching projects")}
              </p>
            </div>
          ) : (
            <div className="flex items-center justify-center">
              <p className="text-body-semibold-14 text-neutral-500">
                No projects found.
              </p>
            </div>
          )}
        </div>
      </main>
    </>
  );
};

export default ProjectTable;
