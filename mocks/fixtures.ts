import type { SessionUser } from "@/context/AuthProvider";
import type { PlatformStatisticsProps } from "@/types/others";
import type { UserProps, UserHistoryProps } from "@/types/users";
import type { ProjectProps, ProjectHistoryProps } from "@/types/projects";
import type { Subscription, SubscriptionResponse } from "@/types/subscriptions";

const now = Math.floor(Date.now() / 1000);

const ts = (daysAgo: number) => ({
  _seconds: now - daysAgo * 86400,
  _nanoseconds: 0,
});

export const mockSessionUser: SessionUser = {
  uid: "mock-admin-001",
  email: "admin@alphadrafts.dev",
  fullName: "Dev Admin",
  roles: ["admin"],
  emailVerified: true,
};

export const mockMetrics: PlatformStatisticsProps = {
  noOfUsers: 1247,
  noOfActiveStarterSubscriptions: 320,
  noOfActiveStudentSubscriptions: 185,
  noOfActiveProfessionalSubscriptions: 92,
  moneyMadeFromStudentPlan: 18499,
  moneyMadeFromProfessionalPlan: 27508,
  noOfProjectsCreated: 4120,
  noOfProjectsCompleted: 2890,
  noOfInstructionAnalyserRan: 7340,
};

const mockUserList: UserProps[] = [
  {
    id: "u1",
    user_id: "u1",
    name: "Alice Johnson",
    email: "alice@example.com",
    phone_number: "+1234567890",
    avatar: "",
    roles: ["user"],
    subscription: { id: "sub1", name: "Professional" },
    accepted_conditions: true,
    created_at: ts(90),
    updated_at: ts(2),
    currentPlan: "Professional",
    noOfProjectsCreated: 12,
    joinedOn: ts(90),
  },
  {
    id: "u2",
    user_id: "u2",
    name: "Bob Smith",
    email: "bob@example.com",
    phone_number: "+1987654321",
    avatar: "",
    roles: ["user"],
    subscription: { id: "sub2", name: "Student" },
    accepted_conditions: true,
    created_at: ts(60),
    updated_at: ts(5),
    currentPlan: "Student",
    noOfProjectsCreated: 7,
    joinedOn: ts(60),
  },
  {
    id: "u3",
    user_id: "u3",
    name: "Carol Williams",
    email: "carol@example.com",
    phone_number: "+1122334455",
    avatar: "",
    roles: ["user"],
    subscription: { id: "sub3", name: "Starter" },
    accepted_conditions: true,
    created_at: ts(30),
    updated_at: ts(1),
    currentPlan: "Starter",
    noOfProjectsCreated: 3,
    joinedOn: ts(30),
  },
  {
    id: "u4",
    user_id: "u4",
    name: "David Brown",
    email: "david@example.com",
    phone_number: "+1555666777",
    avatar: "",
    roles: ["user"],
    subscription: { id: "sub4", name: "Professional" },
    accepted_conditions: true,
    created_at: ts(15),
    updated_at: ts(0),
    currentPlan: "Professional",
    noOfProjectsCreated: 21,
    joinedOn: ts(15),
  },
  {
    id: "u5",
    user_id: "u5",
    name: "Eva Martinez",
    email: "eva@example.com",
    phone_number: "+1444555666",
    avatar: "",
    roles: ["user"],
    subscription: { id: "sub5", name: "Student" },
    accepted_conditions: false,
    created_at: ts(7),
    updated_at: ts(0),
    currentPlan: "Student",
    noOfProjectsCreated: 1,
    joinedOn: ts(7),
  },
];

export const mockUsers: UserHistoryProps = {
  data: mockUserList,
  totalCount: 1247,
};

const mockProjectList: ProjectProps[] = [
  {
    creatorName: "Alice Johnson",
    name: "Business Plan Q4",
    status: "completed",
    userId: "u1",
    createdAt: ts(45),
  },
  {
    creatorName: "Bob Smith",
    name: "Marketing Strategy",
    status: "completed",
    userId: "u2",
    createdAt: ts(30),
  },
  {
    creatorName: "Carol Williams",
    name: "Product Roadmap",
    status: "draft",
    userId: "u3",
    createdAt: ts(10),
  },
  {
    creatorName: "David Brown",
    name: "Investor Pitch Deck",
    status: "completed",
    userId: "u4",
    createdAt: ts(5),
  },
  {
    creatorName: "Eva Martinez",
    name: "Growth Analysis",
    status: "draft",
    userId: "u5",
    createdAt: ts(2),
  },
];

export const mockProjects: ProjectHistoryProps = {
  status: "success",
  message: "Projects fetched",
  data: mockProjectList,
  totalCount: 4120,
};

const mockSubscriptionList: Subscription[] = [
  {
    id: "s1",
    planName: "Professional",
    amountPaid: 29.99,
    status: "active",
    paymentDate: ts(1),
  },
  {
    id: "s2",
    planName: "Student",
    amountPaid: 9.99,
    status: "active",
    paymentDate: ts(5),
  },
  {
    id: "s3",
    planName: "Starter",
    amountPaid: 0,
    status: "active",
    paymentDate: ts(30),
  },
  {
    id: "s4",
    planName: "Professional",
    amountPaid: 29.99,
    status: "expired",
    paymentDate: ts(60),
  },
  {
    id: "s5",
    planName: "Student",
    amountPaid: 9.99,
    status: "active",
    paymentDate: ts(3),
  },
];

export const mockSubscriptions: SubscriptionResponse = {
  data: mockSubscriptionList,
  totalCount: 597,
  skip: 0,
  take: 50,
  hasMore: true,
};
