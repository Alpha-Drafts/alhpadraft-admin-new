import type { NextApiRequest, NextApiResponse } from "next";

export default function handler(_req: NextApiRequest, res: NextApiResponse) {
  res.setHeader(
    "Set-Cookie",
    "csrf_token=mock-csrf-token-dev; Path=/; HttpOnly=false; SameSite=Lax",
  );
  res.status(200).json({ status: "success", message: "CSRF token set" });
}
