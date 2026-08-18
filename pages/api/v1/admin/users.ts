import type { NextApiRequest, NextApiResponse } from "next";
import { mockUsers } from "@/mocks/fixtures";

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  const skip = Number(req.query.skip) || 0;
  const take = Number(req.query.take) || 50;

  const sliced = mockUsers.data.slice(skip, skip + take);

  res.status(200).json({
    code: 200,
    status: "success",
    message: "Users fetched",
    data: { data: sliced, totalCount: mockUsers.totalCount },
  });
}
