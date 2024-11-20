import { Request, Response } from "express";
import { v4 } from "uuid";
import { IPendingStatesResponse } from "../../types";

export const get = async (req: Request, res: Response) => {
    if (req.method !== "GET") return res.status(405);

    // TODO: I dont really see the point of implementing this
    return res.json({
        MessageId: v4(),
        Success: true,
        Errors: [],
        States: [
            {
                Id: 1,
                Description: "State 1",
            },
        ],
    } as IPendingStatesResponse);
};
