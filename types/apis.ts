export interface ApiResponseProps<T = object> {
  code: number;
  status: "success" | "error" | string;
  message: string;
  error?: unknown;
  data?: T;
}

// The example Props for endpoint template
export interface ItemCreateProps {
  name: string;
  description: string;
  type: string;
}

export interface ItemProps extends ItemCreateProps {
  id: string;
  user_id: string;
  created_at: {
    _seconds: number;
    _nanoseconds: number;
  };
  updated_at: {
    _seconds: number;
    _nanoseconds: number;
  };
}

export interface ItemHistoryProps {
  data: ItemProps[];
  total_count: number;
}
