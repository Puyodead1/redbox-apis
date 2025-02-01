import { Joi } from "celebrate";

export const IOTCertificateValidRequestSchema = Joi.object({
    type: Joi.string().required(),
    name: Joi.string().required(),
    thingGroupName: Joi.string().required(),
    certificateId: Joi.string().required(),
}).meta({ className: "IOTCertificateValidRequest" });
