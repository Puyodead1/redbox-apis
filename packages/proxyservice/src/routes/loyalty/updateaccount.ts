import { BaseResponse, loyalty } from "@redbox-apis/common";
import { Request, Response } from "express";
import { v4 } from "uuid";

export const post = [
  async (req: Request, res: Response) => {
    if (req.method !== "POST") return res.status(405);
    const update = await loyalty.createAccount(req.body);

    if (!update.success)
      return res.status(500).json({
        messageId: v4(),
        kioskId: req.body.KioskId,
        error: update.reason,
      });

    await loyalty.sendSignup(
      update.data.emailAddress,
      update.data.tempPassword,
      req.body.KioskId,
    ); // send email of temporary password

    return res.json({
      MessageId: v4(),
      Success: true,
      Errors: [],
      kioskId: req.body.KioskId,
      customerProfileNumber: update.data.cpn,
      mobilePhoneNumber: update.data?.phoneNumber || "",
      tempPassword: update.data.tempPassword, // this is a temporary password for their Redbox account
    } as BaseResponse & {
      customerProfileNumber: string;
      mobilePhoneNumber: string;
      tempPassword: string;
    });
  },
];
