import { Joi } from "celebrate";

export const KioskStatisticsObject = Joi.object({
  Damaged: Joi.string().required(),
  DumpBin: Joi.string().required(),
  EmptySlots: Joi.string().required(),
  InventoryData: Joi.string().required(),
  ProfileData: Joi.string().required(),
  RebalancesInKiosk: Joi.string().required(),
  ThinDiscs: Joi.string().required(),
  TotalDiscs: Joi.string().required(),
  UnknownDiscs: Joi.string().required(),
  UnknownTitle: Joi.string().required(),
  UnmatchedInKiosk: Joi.string().required(),
  WrongTitle: Joi.string().required(),
});

export const KioskStatisticsRequestSchema = Joi.object({
  MessageId: Joi.string().optional(),
  CreatedOn: Joi.date().iso().required(),
  CreatedOnLocal: Joi.string().required(),
  KioskId: Joi.number().required(),
  Statistics: KioskStatisticsObject.required(),
}).meta({ className: "KioskStatisticsRequest" });
