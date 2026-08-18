import type { NextApiRequest, NextApiResponse } from "next";

export default function handler(_req: NextApiRequest, res: NextApiResponse) {
  res.setHeader("Set-Cookie", [
    "access_token=; Path=/; Max-Age=0",
    "refresh_token=; Path=/; Max-Age=0",
    "csrf_token=; Path=/; Max-Age=0",
  ]);
  res.status(200).json({ status: "success", message: "Logged out" });
}
