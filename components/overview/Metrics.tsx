import { MetricsCard } from "@/common";
import { adminRoutes } from "@/constants";
import { PlatformStatisticsProps } from "@/types";
import { formatNumberWithCommas, formatPrices } from "@/utils";
import {
  Users,
  FileText,
  BadgeCheck,
  BarChart2,
  Rocket,
  CheckCircle2,
  ActivitySquare,
} from "lucide-react";
import React from "react";

const Metrics = ({ data }: { data: PlatformStatisticsProps }) => {
  return (
    <section className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-5">
      <MetricsCard
        title="Total Users"
        value={formatNumberWithCommas(data?.noOfUsers || 0)}
        icon={<Users />}
        tooltipText="All registered users on AlphaDrafts."
        link={adminRoutes?.users}
      />
      <MetricsCard
        title="Active Starter Subscriptions"
        value={formatNumberWithCommas(
          data?.noOfActiveStarterSubscriptions || 0,
        )}
        icon={<BadgeCheck />}
        tooltipText="Users currently subscribed to the Starter plan."
        link={adminRoutes?.subscriptions}
      />
      <MetricsCard
        title="Active Student Subscriptions"
        value={formatNumberWithCommas(
          data?.noOfActiveStudentSubscriptions || 0,
        )}
        subValue={formatPrices(data?.moneyMadeFromStudentPlan || 0, "USD")}
        icon={<BarChart2 />}
        tooltipText="Users currently subscribed to the Student plan with the total revenue."
        link={adminRoutes?.subscriptions}
      />
      <MetricsCard
        title="Active Professional Subscriptions"
        value={formatNumberWithCommas(
          data?.noOfActiveProfessionalSubscriptions || 0,
        )}
        subValue={formatPrices(data?.moneyMadeFromProfessionalPlan || 0, "USD")}
        icon={<Rocket />}
        tooltipText="Users currently subscribed to the Professional plan with the total revenue."
        link={adminRoutes?.subscriptions}
      />
      <MetricsCard
        title="Total Projects Created"
        value={formatNumberWithCommas(data?.noOfProjectsCreated || 0)}
        icon={<FileText />}
        tooltipText="Projects that have been created by users."
      />
      <MetricsCard
        title="Total Projects Completed"
        value={formatNumberWithCommas(data?.noOfProjectsCompleted || 0)}
        icon={<CheckCircle2 />}
        tooltipText="Projects that have been marked as completed."
      />
      <MetricsCard
        title="Total Instruction Analysed"
        value={formatNumberWithCommas(data?.noOfInstructionAnalyserRan || 0)}
        icon={<ActivitySquare />}
        tooltipText="Number of times the instruction analyser tool has been used."
      />
    </section>
  );
};

export default Metrics;
