import {
  Config,
  BaseResponse,
  EncryptionService,
  EncryptionType,
} from "@redbox-apis/common";
import { celebrate, Segments } from "celebrate";
import { Request, Response } from "express";
import { KioskAuthenticateRequest } from "../../interfaces";
import { KioskAuthenticateRequestSchema } from "../../schemas";

import dotenv from "dotenv";
import { v4 } from "uuid";
dotenv.config({ path: "../../.env" });

type LoginType = "desktop" | "field";
const getLocalCredentials = async (username: string, type: LoginType) => {
  try {
    const config = Config.get();
    const cred = config.loginInfo?.[type];

    return (
      cred?.find(
        (user: { username: string; password: string }) =>
          user.username === username,
      ) || null
    );
  } catch (error) {
    return null;
  }
};

export const post = [
  celebrate({
    [Segments.BODY]: KioskAuthenticateRequestSchema,
  }),
  async (req: Request, res: Response) => {
    if (req.method !== "POST") return res.status(405);

    const { Username, Password, UseNtAuthentication } =
      req.body as KioskAuthenticateRequest;
    const credentials = await getLocalCredentials(
      Username,
      UseNtAuthentication ? "desktop" : "field",
    );
    const encService = new EncryptionService();

    if (
      credentials &&
      encService.decrypt(Password, EncryptionType.LOCAL) ===
        credentials.password
    ) {
      console.log(
        `A new login has been authorized for ${
          UseNtAuthentication ? "Redbox Desktop" : "Field Maintenance"
        } (user ${Username}).`,
      );

      return res.json({ success: true });
    } else {
      console.log(
        `A new login has been rejected for ${UseNtAuthentication ? "Redbox Desktop" : "Field Maintenance"}.`,
      );
      console.log(
        `Username: ${Username} (${credentials ? "found" : "not found"})`,
      );
      console.log(
        "Password:",
        encService.decrypt(Password, EncryptionType.LOCAL),
      );

      return res
        .status(401)
        .json({ Success: false, MessageId: v4(), Errors: [] } as BaseResponse);
    }
  },
];
