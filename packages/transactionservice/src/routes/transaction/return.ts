import { celebrate, Segments } from "celebrate";
import { Request, Response } from "express";
import { v4 } from "uuid";
import { ReturnRequest } from "../../interfaces";
import { ReturnRequestSchema } from "../../schemas/ReturnRequestSchema";

export const post = [
    celebrate({
        [Segments.BODY]: ReturnRequestSchema,
    }),
    async (req: Request, res: Response) => {
        if (req.method !== "POST") return res.status(405);

        const body: ReturnRequest = req.body;

        const MessageId = v4();

        return res.json({
            MessageId,
            Success: true,
            Errors: [],
        });
    },
];
