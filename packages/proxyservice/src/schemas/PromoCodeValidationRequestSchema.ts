import { Joi } from "celebrate";

export const PromoCodeValidationRequestSchema = Joi.object({
  MessageId: Joi.string().required(),
  KioskId: Joi.number().required(),
  Code: Joi.string().required(),
}).meta({ className: "PromoCodeValidationRequest" });
