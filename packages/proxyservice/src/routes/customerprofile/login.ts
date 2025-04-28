import { celebrate, Segments } from "celebrate";
import { Request, Response } from "express";
import { CustomerLoginRequest } from "../../interfaces";
import { CustomerLoginRequestSchema } from "../../schemas";
import { EncryptionService, EncryptionType } from "@redbox-apis/common";
import { loyalty } from "@redbox-apis/common";
import bcrypt from "bcryptjs";

export const post = [
  celebrate({
    [Segments.BODY]: CustomerLoginRequestSchema,
  }),
  async (req: Request, res: Response) => {
    if (req.method !== "POST") return res.status(405);
    const body = req.body as CustomerLoginRequest;

    const isEmailAuth = body.EmailAddress && body.Password; // user authenticated with email and password
    const isPinAuth = body.PhoneNumber && body.Pin; // user authenticated with phone number and PIN
    let user;

    if (isEmailAuth || isPinAuth) {
      const identifier = isEmailAuth ? body.EmailAddress! : body.PhoneNumber!; // user identifier
      const credential = isEmailAuth ? body.Password! : body.Pin!; // user authentication

      const getUser = isEmailAuth
        ? await loyalty.getUserByEmail(identifier)
        : await loyalty.getUserByPhoneNumber(identifier);
      const encService = new EncryptionService();
      let authentication = body.IsEncrypted
        ? encService.decrypt(credential, EncryptionType.CUSTOMER)
        : credential;
      if (!getUser)
        return res.json({
          success: false,
          errors: [
            {
              code: "400",
              message: "It looks like you don't have an account yet!",
            },
          ],
        });

      if (getUser?.disabled === true)
        return res.json({
          success: false,
          errors: [
            {
              code: "403",
              message:
                "Your account has been flagged and terminated! Please contact customer support.",
            },
          ],
        });

      if (getUser.hashed) {
        // if authentication method is hashed w/ bcrypt
        if (
          await bcrypt.compare(
            authentication,
            getUser?.[isEmailAuth ? "password" : "pin"] || "",
          )
        ) {
          user = getUser;
        }
      } else {
        // if the authentication method is plain-text storage
        if (
          (getUser?.[isEmailAuth ? "password" : "pin"] || "") === authentication
        ) {
          user = getUser;
        }
      }
    }

    let response;
    if (!user) {
      response = {
        success: false,
        errors: [
          {
            code: "400",
            message:
              "It looks like the login information provided is incorrect!",
          },
        ],
      };
    } else {
      response = {
        response: {
          customer: {
            cpn: user.cpn,
            firstName: user?.firstName || "Customer",
            promptForPerks: false,
            promptForEarlyId: false,

            ...(user?.emailAddress && { loginEmail: user.emailAddress }), // email address (if exists)
            ...(user?.phoneNumber && { mobilePhoneNumber: user.phoneNumber }), // phone number (if exists)
          },
          loyalty: {
            loyaltySystemOnline: true,
            isEnrolled: true,
            pointBalance: user.loyalty.pointBalance,
            currentTier: user.loyalty.currentTier,
            currentTierCounter: user.loyalty.tierCounter,
          },
          promoCodes: user.promoCodes,
          optIns: [],
        },
        success: true,
        statusCode: 200,
      };
    }

    return res.json(response);
  },
];
