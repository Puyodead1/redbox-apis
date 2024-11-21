import { celebrate, Joi, Segments } from "celebrate";
import { Request, Response } from "express";

const ParamsSchema = Joi.object({
    kioskId: Joi.string().required(),
    orderId: Joi.string().required(),
});

const QuerySchema = Joi.object({
    orderType: Joi.number().optional(),
});

export const get = [
    celebrate({
        [Segments.PARAMS]: ParamsSchema,
        [Segments.QUERY]: QuerySchema,
    }),
    async (req: Request, res: Response) => {
        if (req.method !== "GET") return res.status(405);

        const kioskId = req.params.kioskId;
        const orderId = req.params.orderId;
        const orderType = req.query.orderType;

        return res.json([
            // {
            //     KioskId: kioskId,
            //     MerchandizingOrderType: orderType,
            //     TitleId: 12345,
            //     UnitCount: 5,
            // },
        ]);
    },
];
