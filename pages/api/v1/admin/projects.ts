import type { NextApiRequest, NextApiResponse } from "next";
import { mockProjects } from "@/mocks/fixtures";

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  const skip = Number(req.query.skip) || 0;
  const take = Number(req.query.take) || 50;
  const status = req.query.status as string | undefined;

  let filtered = mockProjects.data;
  if (status) {
    filtered = filtered.filter((p) => p.status === status);
  }

  const sliced = filtered.slice(skip, skip + take);

  res.status(200).json({
    code: 200,
    status: "success",
    message: "Projects fetched",
    data: {
      status: "success",
      message: "Projects fetched",
      data: sliced,
      totalCount: filtered.length,
    },
  });
}
