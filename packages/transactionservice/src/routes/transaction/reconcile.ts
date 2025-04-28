import {
  loyalty,
  ReconcileRequest,
  ReconcileRequestSchema,
} from "@redbox-apis/common";
import { celebrate, Segments } from "celebrate";
import { Request, Response } from "express";
import { v4 } from "uuid";
import { ReconcileResponse } from "../../types";

// This confirms the transaction and processes it, once the discs are dispensed (runs after email confirmation, and disc vending)
export const post = [
  celebrate({
    [Segments.BODY]: ReconcileRequestSchema,
  }),
  async (req: Request, res: Response) => {
    if (req.method !== "POST") return res.status(405);

    const body = req.body as ReconcileRequest;

    const transNumber = await loyalty.createTransNumber(); // create a transaction number for reference
    await loyalty.logTransaction(transNumber, body); // process the transaction

    if (body.CustomerProfileNumber) {
      const user = await loyalty.getUserByProfileNumber(
        body.CustomerProfileNumber,
      );
      if (user) {
        await loyalty.initialRewards(user, body.ShoppingCart); // update user rewards if logged in
      }
    }

    if (body.Email) {
      await loyalty.sendReceipt(transNumber, body); // send a receipt copy if email was provided
    }

    return res.json({
      CustomerProfileNumber: body.CustomerProfileNumber,
      Success: true,
      StatusCode: 200,
      Errors: [],
      MessageId: v4(),
    } as ReconcileResponse);
  },
];
