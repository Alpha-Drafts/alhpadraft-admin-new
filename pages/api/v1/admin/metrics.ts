import type { NextApiRequest, NextApiResponse } from "next";
import { mockMetrics } from "@/mocks/fixtures";

export default function handler(_req: NextApiRequest, res: NextApiResponse) {
  res.status(200).json({
    code: 200,
    status: "success",
    message: "Metrics fetched",
    data: mockMetrics,
  });
}
