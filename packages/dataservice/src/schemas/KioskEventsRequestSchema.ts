import { KioskBaseRequestSchema } from "@redbox-apis/common";
import { Joi } from "celebrate";

export const KioskEventsRequestSchema = KioskBaseRequestSchema.keys({
  CreatedOn: Joi.string(), // datetime
  CreatedOnLocal: Joi.string(),
  KioskEventsData: Joi.string(),
}).meta({ className: "KioskEventsRequest" });
