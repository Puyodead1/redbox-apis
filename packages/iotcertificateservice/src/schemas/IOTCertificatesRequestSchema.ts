import { Joi } from "celebrate";

export const IOTCertificatesRequestSchema = Joi.object({
  type: Joi.string().required(),
  name: Joi.string().required(),
  thingGroupName: Joi.string().required(),
}).meta({ className: "IOTCertificatesRequest" });
