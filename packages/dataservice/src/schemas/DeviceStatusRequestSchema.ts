import { Joi } from "celebrate";
import { ErrorState } from "../interfaces/ErrorState";

export const DeviceStatusRequestSchema = Joi.object({
  Id: Joi.number().optional(),
  Serial: Joi.string(),
  MfgSerial: Joi.string(),
  LocalTime: Joi.string(), // TODO: validate
  Assembly: Joi.string(),
  RBA: Joi.string(),
  TgzVersion: Joi.string(),
  RevisionNumber: Joi.number(),
  EMVContactVersion: Joi.string(),
  EMVClessVersion: Joi.string(),
  SupportsVas: Joi.boolean(),
  InjectedKeys: Joi.string(),
  ErrorState: Joi.number().valid(...Object.values(ErrorState)),
}).meta({ className: "DeviceStatusRequest" });
