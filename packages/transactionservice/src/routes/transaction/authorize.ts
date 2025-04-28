import {
  AuthorizeRequest,
  AuthorizeRequestSchema,
  BaseResponse,
} from "@redbox-apis/common";
import { celebrate, Segments } from "celebrate";
import { Request, Response } from "express";
import { v4 } from "uuid";

// This authorizes the transaction to ensure all card details are correct (runs after zip code entry)
export const post = [
  celebrate({
    [Segments.BODY]: AuthorizeRequestSchema,
  }),
  async (req: Request, res: Response) => {
    if (req.method !== "POST") return res.status(405);

    const body: AuthorizeRequest = req.body;

    return res.json({
      Success: true,
      Errors: [],
      MessageId: v4(),
    } as BaseResponse); // continue with processing
  },
];
