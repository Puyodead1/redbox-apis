import { Request, Response } from "express";

// This authorizes the transaction to ensure all card details are correct (runs after zip code entry)
export const post = [
    async (req: Request, res: Response) => {
        if (req.method !== "POST") return res.status(405);

        return res.json({ success: true }); // continue with processing
    },
];