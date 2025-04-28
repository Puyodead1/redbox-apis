import { Joi } from "celebrate";
import { ErrorState } from "../interfaces/ErrorState";

export const DeviceStatusRequestSchema = Joi.object({
  Id: Joi.number().optional(),
  Serial: Joi.string().required(),
  MfgSerial: Joi.string().required(),
  LocalTime: Joi.date().iso().required(),
  Assembly: Joi.string().required(),
  RBA: Joi.string().required(),
  TgzVersion: Joi.string().required(),
  RevisionNumber: Joi.number().required(),
  EMVContactVersion: Joi.string().required(),
  EMVClessVersion: Joi.string().required(),
  SupportsVas: Joi.boolean().required(),
  InjectedKeys: Joi.string().required(),
  ErrorState: Joi.number()
    .valid(...Object.values(ErrorState))
    .required(),
}).meta({ className: "DeviceStatusRequest" });
