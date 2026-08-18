import { PROJECT_STATUS_OPTIONS } from "@/constants";

export type ProjectStatusType = (typeof PROJECT_STATUS_OPTIONS)[number];

export interface ProjectProps {
  creatorName: string;
  name: string;
  status: ProjectStatusType | null;
  userId: string;
  createdAt: { _seconds: number; _nanoseconds: number };
}

export interface ProjectHistoryProps {
  status: string;
  message: string;
  data: ProjectProps[];
  totalCount: number;
}
