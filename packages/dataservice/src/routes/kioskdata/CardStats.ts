import { celebrate, Segments } from "celebrate";
import { Request, Response } from "express";
import StandardResponse from "../../interfaces/StandardResponse";
import { CardStatsRequestSchema } from "../../schemas/CardStatsRequestSchema";

export const post = [
    celebrate({
        [Segments.BODY]: CardStatsRequestSchema,
    }),
    async (req: Request, res: Response) => {
        if (req.method !== "POST") return res.status(405);

        res.json({
            Success: true,
            Errors: [],
            StatusCode: 200,
        } as StandardResponse);
    },
];
