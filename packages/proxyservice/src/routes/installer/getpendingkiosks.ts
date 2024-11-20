import { celebrate, Joi, Segments } from "celebrate";
import { Request, Response } from "express";
import { v4 } from "uuid";
import { IPendingKiosksResponse } from "../../types";

export const get = [
    celebrate({
        [Segments.QUERY]: {
            stateid: Joi.string().required(),
            bannerid: Joi.string().required(),
        },
    }),
    async (req: Request, res: Response) => {
        if (req.method !== "GET") return res.status(405);

        // TODO: I dont really see the point of implementing this
        const stateId = req.query.stateid;
        const bannerId = req.query.bannerid;

        res.json({
            MessageId: v4(),
            Success: true,
            Errors: [],
            PendingKiosks: [
                {
                    Id: 1,
                    Address: "11111",
                    City: "idk",
                    State: "yes",
                    ZipCode: "66666",
                    DueTime: "09:00PM",
                    MarketName: "Dollar General",
                    KaseyaMarketName: "toleto_oh",
                },
            ],
        } as IPendingKiosksResponse);
    },
];
