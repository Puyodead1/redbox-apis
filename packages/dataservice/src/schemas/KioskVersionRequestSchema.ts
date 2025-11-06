import { KioskBaseRequestSchema } from "@redbox-apis/common";
import { Joi } from "celebrate";

export const KioskVersionRequestSchema = KioskBaseRequestSchema.keys({
  UniqueId: Joi.string(),
  CreatedOn: Joi.string(), // datetime
  CreatedOnLocal: Joi.string(),
  Versions: Joi.object().pattern(Joi.string(), Joi.string()), // TODO: define better schema if possible
}).meta({ className: "KioskVersionRequest" });
