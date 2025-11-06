import { KioskBaseRequestSchema } from "@redbox-apis/common";
import { Joi } from "celebrate";

export const KioskAlertRequestSchema = KioskBaseRequestSchema.keys({
  UniqueId: Joi.string(),
  CreatedOn: Joi.string(), // datetime
  CreatedOnLocal: Joi.string(),
  AlertType: Joi.number(),
  SubAlertType: Joi.string(),
  AlertMessage: Joi.string(),
}).meta({ className: "KioskAlertRequest" });
