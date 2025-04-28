import { Joi } from "celebrate";
import { RebootType } from "../interfaces/RebootType";

export const RebootStatusRequestSchema = Joi.object({
  Id: Joi.string().optional(),
  Type: Joi.number()
    .valid(...Object.values(RebootType))
    .required(),
  DisconnectTime: Joi.date().iso().optional(),
  ConnectTime: Joi.date().iso().optional(),
  ExpectedTime: Joi.date().iso().optional(),
  DeviceTime: Joi.date().iso().optional(),
  KioskId: Joi.number().required(),
}).meta({ className: "RebootStatusRequest" });
