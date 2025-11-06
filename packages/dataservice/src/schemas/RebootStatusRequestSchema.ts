import { Joi } from "celebrate";
import { RebootType } from "../interfaces/RebootType";

export const RebootStatusRequestSchema = Joi.object({
  Id: Joi.string(),
  Type: Joi.number().valid(...Object.values(RebootType)),
  DisconnectTime: Joi.string(), // datetime
  ConnectTime: Joi.string(), // datetime
  ExpectedTime: Joi.string(), // datetime
  DeviceTime: Joi.string(), // datetime
  KioskId: Joi.number(),
}).meta({ className: "RebootStatusRequest" });
