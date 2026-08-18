export interface Subscription {
  id: string;
  planName: string;
  amountPaid: string | number;
  status: string;
  paymentDate: {
    _seconds: number;
    _nanoseconds: number;
  };
}

export interface SubscriptionResponse {
  data: Subscription[];
  totalCount: number;
  skip: number;
  take: number;
  hasMore: boolean;
}
