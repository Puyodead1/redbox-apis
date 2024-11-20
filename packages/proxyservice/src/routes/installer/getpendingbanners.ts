import { celebrate, Joi, Segments } from "celebrate";
import { Request, Response } from "express";
import { v4 } from "uuid";
import { IPendingBannersResponse } from "../../types";

export const get = [
    celebrate({
        [Segments.QUERY]: {
            stateid: Joi.string().required(),
        },
    }),
    async (req: Request, res: Response) => {
        if (req.method !== "GET") return res.status(405);

        // TODO: I dont really see the point of implementing this
        const stateId = req.query.stateid as string;

        return res.json({
            MessageId: v4(),
            Success: true,
            Errors: [],
            Banners: [
                {
                    Id: 1,
                    Name: "Banner 1",
                },
            ],
        } as IPendingBannersResponse);
    },
];
