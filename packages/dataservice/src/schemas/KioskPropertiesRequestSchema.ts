import { KioskBaseRequestSchema } from "@redbox-apis/common";
import { Joi } from "celebrate";

export const KioskPropertiesRequestSchema = KioskBaseRequestSchema.keys({
  CreatedOn: Joi.string(), // datetime
  CreatedOnLocal: Joi.string(),
  Properties: Joi.object().pattern(Joi.string(), Joi.string()), // TODO: define better schema if possible
}).meta({ className: "KioskPropertiesRequest" });
