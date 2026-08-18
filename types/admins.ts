import { ADMIN_ROLES } from "@/constants";
import { UserRoleType } from "./users";

export type AdminRoleType = (typeof ADMIN_ROLES)[number];

export interface AdminProps {
  id: string;
  user_id: string;
  name: string;
  email: string;
  phone_number: string;
  photo_url: string;
  roles: Array<UserRoleType>;
  created_at: {
    _seconds: number;
    _nanoseconds: number;
  };
  updated_at: {
    _seconds: number;
    _nanoseconds: number;
  };
}

export interface AdminHistoryProps {
  data: AdminProps[];
  total_count: number;
}

export interface AdminCountProps {
  admins_count: number;
  super_admins_count: number;
}
