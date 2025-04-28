import { Request, Response } from "express";
import { v4 } from "uuid";
import { IPendingStatesResponse } from "../../types";
import { states } from "@redbox-apis/db";

export const get = async (req: Request, res: Response) => {
  if (req.method !== "GET") return res.status(405);

  return res.json({
    MessageId: v4(),
    Success: true,
    Errors: [],
    States: states,
  } as IPendingStatesResponse);
};
