import { Request, Response } from "express";
import { loyalty } from "@redbox-apis/common";

export const post = [
    async (req: Request, res: Response) => {
        if (req.method !== "POST") return res.status(405);
        const user = await loyalty.getUserByProfileNumber(req.body.CustomerProfileNumber); // get user tier

        if(user) {
            return res.json({
                "items": loyalty.estimateAccrual(user, req.body.ShoppingCart),
                "kioskId": req.body.KioskId,
                "success": true,
                "statusCode": 200
            });
        }
    },
];
