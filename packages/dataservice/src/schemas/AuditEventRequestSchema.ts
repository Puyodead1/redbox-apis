import { KioskBaseRequestSchema } from "@redbox-apis/common";
import { Joi } from "celebrate";

export const AuditEventRequestSchema = KioskBaseRequestSchema.keys({
  LogDate: Joi.string(), // datetime
  CreatedOnLocal: Joi.string(),
  EventType: Joi.string(),
  Username: Joi.string(),
  Message: Joi.string(),
  Source: Joi.string(),
}).meta({ className: "AuditEventRequest" });
