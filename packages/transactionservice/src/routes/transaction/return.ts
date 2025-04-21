import { Request, Response } from "express";
import { loyalty } from "@redbox-apis/common";

// This occurs when a user returns their disc at a kiosk
export const post = [
    async (req: Request, res: Response) => {
        if (req.method !== "POST") return res.status(405);

        const transactions = await loyalty.returnedDisc(req.body?.KioskId, req.body?.Barcode, req.body?.ReturnDate);
        if(!transactions) return res.json({ success: true });

        for (const transaction of transactions) {
            if(transaction.customerProfileNumber) {
                await loyalty.updateRewards(req.body?.Barcode, transaction);
            }
        }

        res.json({ success: true });
    },
];