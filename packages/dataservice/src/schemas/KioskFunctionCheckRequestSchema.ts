import { KioskBaseRequestSchema } from "@redbox-apis/common";
import { Joi } from "celebrate";

export const KioskFunctionCheckRequestSchema = KioskBaseRequestSchema.keys({
  CreatedOn: Joi.string(), // datetime
  CreatedOnLocal: Joi.string(),
  ReportTime: Joi.string(), // datetime
  UserName: Joi.string(),
  InitTest: Joi.string(),
  TrackTest: Joi.string(),
  VendDoor: Joi.string(),
  VerticalSlot: Joi.string(),
  CameraDriver: Joi.string(),
  SnapDecode: Joi.string(),
  TouchScreenDriver: Joi.string(),
}).meta({ className: "KioskFunctionCheckRequest" });
