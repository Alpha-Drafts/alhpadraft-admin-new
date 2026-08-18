import type { NextApiRequest, NextApiResponse } from "next";
import { mockSubscriptions } from "@/mocks/fixtures";

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  const skip = Number(req.query.skip) || 0;
  const take = Number(req.query.take) || 50;
  const name = req.query.name as string | undefined;
  const status = req.query.status as string | undefined;

  let filtered = mockSubscriptions.data;
  if (name) {
    filtered = filtered.filter((s) =>
      s.planName.toLowerCase().includes(name.toLowerCase()),
    );
  }
  if (status) {
    filtered = filtered.filter((s) => s.status === status);
  }

  const sliced = filtered.slice(skip, skip + take);

  res.status(200).json({
    code: 200,
    status: "success",
    message: "Subscriptions fetched",
    data: {
      data: sliced,
      totalCount: filtered.length,
      skip,
      take,
      hasMore: skip + take < filtered.length,
    },
  });
}
