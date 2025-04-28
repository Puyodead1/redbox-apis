import { Request, Response } from "express";

export const get = async (req: Request, res: Response) => {
  if (req.method !== "GET") return res.status(405);

  res.send("temporary dummy route");
};
