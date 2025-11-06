import { KioskBaseRequestSchema } from "@redbox-apis/common";
import { Joi } from "celebrate";

export const KioskStatisticsSchema = Joi.object({
  Damaged: Joi.string(),
  DumpBin: Joi.string(),
  EmptySlots: Joi.string(),
  InventoryData: Joi.string(),
  ProfileData: Joi.string(),
  RebalancesInKiosk: Joi.string(),
  ThinDiscs: Joi.string(),
  TotalDiscs: Joi.string(),
  UnknownDiscs: Joi.string(),
  UnknownTitle: Joi.string(),
  UnmatchedInKiosk: Joi.string(),
  WrongTitle: Joi.string(),
}).meta({ className: "KioskStatistics" });

export const KioskStatisticsRequestSchema = KioskBaseRequestSchema.keys({
  CreatedOn: Joi.string(), // datetime
  CreatedOnLocal: Joi.string(),
  Statistics: KioskStatisticsSchema,
}).meta({ className: "KioskStatisticsRequest" });
