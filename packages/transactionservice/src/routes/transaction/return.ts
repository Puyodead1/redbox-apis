import { celebrate, Segments } from "celebrate";
import { Request, Response } from "express";
import { ReturnRequest } from "../../interfaces";
import { ReturnRequestSchema } from "../../schemas";

export const post = [
    celebrate({
        [Segments.BODY]: ReturnRequestSchema,
    }),
    async (req: Request, res: Response) => {
        if (req.method !== "POST") return res.status(405);

        const body: ReturnRequest = req.body;

        return res.sendStatus(200);
    },
];
