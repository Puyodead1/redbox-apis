import { Joi } from "celebrate";

export const IOTCertificateGenerateRequestSchema = Joi.object({
  type: Joi.string().required(),
  name: Joi.string().required(),
  thingGroupName: Joi.string().required(),
}).meta({ className: "IOTCertificateGenerateRequest" });
