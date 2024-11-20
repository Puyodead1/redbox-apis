import { Request, Response } from "express";
import { ELocationType, INearbyKiosksResponse } from "../../../types";

export const get = async (req: Request, res: Response) => {
    if (req.method !== "GET") return res.status(405);

    // TODO: real data?
    return res.json({
        Kiosks: [
            {
                Address: "5028 W Ridge Rd Erie, PA 16506-1216",
                DistanceMiles: 0.1,
                IsDual: false,
                KioskId: 10001,
                LocationName: "Wegmans",
                LocationType: ELocationType.Indoor,
            },
        ],
    } as INearbyKiosksResponse);
};
