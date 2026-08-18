import type { NextApiRequest, NextApiResponse } from "next";
import { mockSessionUser } from "@/mocks/fixtures";

function getCookie(req: NextApiRequest, name: string): string | undefined {
  const raw = req.headers.cookie || "";
  const match = raw.split("; ").find((c) => c.startsWith(`${name}=`));
  return match ? match.split("=").slice(1).join("=") : undefined;
}

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== "GET") {
    return res.status(405).json({ status: "error", message: "Method not allowed" });
  }

  const token = getCookie(req, "access_token");
  if (!token) {
    return res.status(401).json({ status: "error", message: "Unauthorized" });
  }

  res.status(200).json({
    status: "success",
    data: {
      uid: mockSessionUser.uid,
      email: mockSessionUser.email,
      fullName: mockSessionUser.fullName,
      roles: mockSessionUser.roles,
      emailVerified: mockSessionUser.emailVerified,
    },
  });
}
