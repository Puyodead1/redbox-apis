import { Joi } from "celebrate";

export const PromoCodeValidationRequestSchema = Joi.object({
    MessageId: Joi.string().required(),
    KioskId: Joi.number().min(1).max(2147483647).required(),
    Code: Joi.string().min(2).max(24).required(),
}).meta({ className: "PromoCodeValidationRequest" });
