import { BaseResponse, loyalty } from "@redbox-apis/common";
import { Request, Response } from "express";
import { v4 } from "uuid";

export const post = [
  async (req: Request, res: Response) => {
    if (req.method !== "POST") return res.status(405);
    const user = await loyalty.getUserByProfileNumber(
      req.body.CustomerProfileNumber,
    ); // get user tier

    if (user) {
      return res.json({
        items: loyalty.estimateAccrual(user, req.body.ShoppingCart),
        kioskId: req.body.KioskId,
        Success: true,
        statusCode: 200,
        Errors: [],
        MessageId: v4(),
      } as BaseResponse & {
        items: any;
        kioskId: string;
      });
    }
  },
];
