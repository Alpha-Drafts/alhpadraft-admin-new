import { USER_ROLES, USER_STATUSES } from "@/constants";
import { PlanType } from "./plans";

export type UserRoleType = (typeof USER_ROLES)[number];

export type UserStatusType = (typeof USER_STATUSES)[number];

export interface UserCreateProps {
  name: string;
  email: string;
  phone_number: string;
  avatar: string;
  roles: Array<UserRoleType>;
  subscription: {
    id: string;
    name: PlanType;
  };
}
export interface UserProps extends UserCreateProps {
  id: string;
  user_id: string;
  accepted_conditions: boolean;
  created_at: {
    _seconds: number;
    _nanoseconds: number;
  };
  updated_at: {
    _seconds: number;
    _nanoseconds: number;
  };
  currentPlan?: string;
  noOfProjectsCreated?: number;
  joinedOn?: {
    _seconds: number;
    _nanoseconds: number;
  };
}

export interface UserHistoryProps {
  data: UserProps[];
  totalCount: number;
}

export interface SetCustomClaimsProps {
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

export interface CustomClaimsProps extends UserCreateProps {
  id: string;
  iss: string;
  aud: string;
  auth_time: number;
  sub: string;
  iat: number;
  exp: number;
  email_verified: boolean;
  firebase: {
    identities: { email: string[] };
    sign_in_provider: string;
  };
  created_at: {
    _seconds: number;
    _nanoseconds: number;
  };
  updated_at: {
    _seconds: number;
    _nanoseconds: number;
  };
}
