import { stores } from "@redbox-apis/db";
import { celebrate, Joi, Segments } from "celebrate";
import { Request, Response } from "express";
import { v4 } from "uuid";
import { IPendingKiosksResponse } from "../../types";

export const get = [
    celebrate({
        [Segments.QUERY]: {
            stateid: Joi.string().required(), // Expect the query params as strings
            bannerid: Joi.string().required(), // Expect the query params as strings
        },
    }),
    async (req: Request, res: Response) => {
        if (req.method !== "GET") return res.status(405);

        // Extract query parameters as strings (Ensure they're strings)
        const stateId = req.query.stateid as string;
        const bannerId = req.query.bannerid as string;

        console.log(`stateId from query: ${stateId}`);
        console.log(`bannerId from query: ${bannerId}`);

        // Filter kiosks based on the stateId and bannerId from the query
        const filteredKiosks = stores
            .filter((kiosk) => kiosk.StateId === stateId && kiosk.BannerId === bannerId)
            .map(({ BannerId, StateId, ...rest }) => rest); // Remove BannerId and StateId from the results as its useless

        // Return the response with filtered data
        res.json({
            MessageId: v4(),
            Success: true,
            Errors: [],
            PendingKiosks: filteredKiosks,
        } as IPendingKiosksResponse);
    },
];
