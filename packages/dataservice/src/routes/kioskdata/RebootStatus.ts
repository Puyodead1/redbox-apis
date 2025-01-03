import { celebrate, Segments } from "celebrate";
import { Request, Response } from "express";
import StandardResponse from "../../interfaces/StandardResponse";
import { RebootStatusRequestSchema } from "../../schemas/RebootStatusRequestSchema";

export const post = [
    celebrate({
        [Segments.BODY]: RebootStatusRequestSchema,
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
