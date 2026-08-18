import React, { useEffect } from "react";
import Metrics from "./Metrics";
import { useFetchHook } from "@/hooks";
import { useClaims } from "@/context";
import { PlatformStatisticsProps } from "@/types";
import { toast } from "react-toastify";
import { LoadingState } from "@/common";
import { API_BASE_URL } from "@/constants";

const OverviewContent = () => {
  const { token } = useClaims();

  const { data, isFetching, error } = useFetchHook<PlatformStatisticsProps>({
    endpoint: `${API_BASE_URL}/v1/admin/metrics`,
    enabled: !!token,
  });

  useEffect(() => {
    if (error) toast.error(error.message);
  }, [error]);

  return (
    <>
      {isFetching && <LoadingState />}

      <h1 className="mb-4 text-2xl font-medium">Overview</h1>

      <main className="flex flex-col gap-y-8">
        <Metrics data={data || ({} as PlatformStatisticsProps)} />
      </main>
    </>
  );
};

export default OverviewContent;
