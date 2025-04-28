import { Joi } from "celebrate";

export const MerchandingStatusUpdateSchema = Joi.object({
  MessageId: Joi.string().optional(),
  ThinDateUTC: Joi.string().optional(),
  ThinReasonCode: Joi.string().optional(),
  MerchandStatus: Joi.string().optional(),
  Barcode: Joi.string().required(),
  UpdateDateTimeUTC: Joi.date().iso().required(),
});

export const UpdateMerchandizingStatusRequestSchema = Joi.array()
  .items(MerchandingStatusUpdateSchema)
  .required()
  .meta({ className: "UpdateMerchandizingStatusRequest" });
