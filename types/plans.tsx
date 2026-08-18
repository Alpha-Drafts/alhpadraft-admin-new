import { PLANS } from "@/constants";

export type PlanType = (typeof PLANS)[number];

export interface PlanProps {
  planType: PlanType;
  amount: number | "custom";
  description: string;
  planBenefits: string[];
}
