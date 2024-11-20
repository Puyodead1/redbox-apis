import { celebrate, Joi, Segments } from "celebrate";
import { Request, Response } from "express";
import { v4 } from "uuid";
import { IGetPlanogramsResponse } from "../../types";

export const get = [
    celebrate({
        [Segments.QUERY]: {
            lastReportedTime: Joi.string().optional(),
        },
    }),
    async (req: Request, res: Response) => {
        if (req.method !== "GET") return res.status(405);

        const lastReportedTime = req.query.lastReportedTime as string | undefined;

        return res.json({
            MessageId: v4(),
            Success: true,
            Errors: [],
            Planograms: [],
        } as IGetPlanogramsResponse);
    },
];
