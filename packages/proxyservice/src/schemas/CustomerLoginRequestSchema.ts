import { Joi } from "celebrate";

export const CustomerLoginRequestSchema = Joi.object({
    MessageId: Joi.string().required(),
    KioskId: Joi.number().required(),
    ActivityId: Joi.string(),
    EmailAddress: Joi.string().email(),
    Password: Joi.string(),
    PhoneNumber: Joi.string(),
    IsEncrypted: Joi.boolean(),
    Pin: Joi.string(),
    CustomerProfileNumber: Joi.string(),
    LanguageCode: Joi.string()
}).meta({ className: "CustomerLoginRequest" });
