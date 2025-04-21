import { Request, Response } from "express";
import { loyalty } from "@redbox-apis/common";

// This confirms the transaction and processes it, once the discs are dispensed (runs after email confirmation, and disc vending)
export const post = [
    async (req: Request, res: Response) => {
        if (req.method !== "POST") return res.status(405);

        const transNumber = await loyalty.createTransNumber(); // create a transaction number for reference
        await loyalty.logTransaction(transNumber, req.body); // process the transaction

        if(req.body?.CustomerProfileNumber) {
            const user = await loyalty.getUserByProfileNumber(req.body.CustomerProfileNumber);
            if (user) {
                await loyalty.initialRewards(user, req.body?.ShoppingCart); // update user rewards if logged in
            }
        }

        if(req.body?.Email) {
            await loyalty.sendReceipt(transNumber, req.body); // send a receipt copy if email was provided
        }

        return res.json({
            "customerProfileNumber": req.body?.CustomerProfileNumber || '',
            "success": true,
            "statusCode": 200
        });
    },
];