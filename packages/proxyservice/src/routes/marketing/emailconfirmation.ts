import { BaseResponse, loyalty } from "@redbox-apis/common";
import { Request, Response } from "express";
import { v4 } from "uuid";

export const post = [
  async (req: Request, res: Response) => {
    if (req.method !== "POST") return res.status(405);

    const user = await loyalty.getUserByEmail(req.body.Email);
    let response: BaseResponse & {
      promptForEarlyId: boolean;
      promptForPerks: boolean;
      emailVerified: boolean;
      statusCode: number;
      [key: string]: any; // add dynamic
    } = {
      MessageId: v4(),
      promptForEarlyId: true, // prompt guest to sign-up at checkout after entering their email (checks if they have an account first)
      promptForPerks: true, // set to true when guest doesn't have an account. if set to false, it will say "you already have an account" and will prompt them to setup their kiosk login on the website
      emailVerified: true, // checks if the email address is valid (to prevent spam?)
      Success: true,
      statusCode: 200,
      Errors: [],
    };

    if (user) {
      // the user already has an account, prompt to visit the website in order to setup their kiosk login
      response.promptForPerks = false;
      response.promptForEarlyId = false;

      // add the user information if exists
      if (user?.cpn) response["customerProfileNumber"] = user.cpn;
      if (user?.phoneNumber) response["mobilePhoneNumber"] = user.phoneNumber;
    }

    return res.json(response);
  },
];
