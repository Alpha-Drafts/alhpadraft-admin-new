import type { NextApiRequest, NextApiResponse } from "next";
import { mockSessionUser } from "@/mocks/fixtures";

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== "POST") {
    return res.status(405).json({ status: "error", message: "Method not allowed" });
  }

  const { email } = req.body as { email?: string; password?: string };

  res.setHeader("Set-Cookie", [
    "access_token=mock-access-token; Path=/; HttpOnly=true; SameSite=Lax",
    "refresh_token=mock-refresh-token; Path=/; HttpOnly=true; SameSite=Lax",
  ]);

  res.status(200).json({
    status: "success",
    data: {
      uid: mockSessionUser.uid,
      email: email || mockSessionUser.email,
      fullName: mockSessionUser.fullName,
    },
  });
}
