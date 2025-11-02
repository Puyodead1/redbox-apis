import { Request, Response } from "express";
import fs from "fs";
import { getPathRelativeRoot } from "@redbox-apis/common";

export const get = async (req: Request, res: Response) => {
  if (req.method !== "GET") return res.status(405);

  const crl = fs.readFileSync(getPathRelativeRoot("certificates", "crl.pem"));
  res.setHeader("Content-Type", "application/pkix-crl");
  return res.send(crl);
};
