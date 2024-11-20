import { Joi } from "celebrate";

export const ReturnRequestSchema = Joi.object({
    Barcode: Joi.string().required(),
    Deck: Joi.number().required(),
    FailedSecurityRead: Joi.boolean().required(),
    KioskId: Joi.number().required(),
    MessageId: Joi.string().required(),
    ReturnDate: Joi.date().iso().required(),
    ReturnType: Joi.number().required(),
    Slot: Joi.number().required(),
}).meta({ className: "ReturnRequest" });
