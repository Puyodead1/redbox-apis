import { Joi } from "celebrate";

export const KioskAuthenticateRequestSchema = Joi.object({
    Username: Joi.string().required(),
    Password: Joi.string().required(),
    UseNtAuthentication: Joi.boolean().required(),
}).meta({ className: "KioskAuthenticateRequest" });