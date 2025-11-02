import { Request, Response } from "express";
import fs from "fs";
import { getPathRelativeRoot } from "@redbox-apis/common";

// a CRL endpoint, tbh i dont even know if this is needed?
// mqtt client was complaining about certification revocation checking, but i dont see it actually calling the endpoint
// TODO: if we do keep this, maybe we should implement other ways of revoking certs rather than just expiry date? idfk
export const get = async (req: Request, res: Response) => {
  if (req.method !== "GET") return res.status(405);

  const crl = fs.readFileSync(getPathRelativeRoot("certificates", "crl.pem"));
  res.setHeader("Content-Type", "application/pkix-crl");
  return res.send(crl);
};
