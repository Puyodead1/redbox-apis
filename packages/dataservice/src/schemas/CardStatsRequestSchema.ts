import { Joi } from "celebrate";
import { CardBrandType } from "../interfaces/CardBrandType";
import { CardReadExitType } from "../interfaces/CardReadExitType";
import { CardSourceType } from "../interfaces/CardSourceType";
import { WalletType } from "../interfaces/WalletType";

export const CardStatsRequestSchema = Joi.object({
  SessionId: Joi.string(),
  Id: Joi.string(),
  KioskId: Joi.number(),
  ManufacturerSerialNumber: Joi.string(),
  RBAVersion: Joi.string(),
  TgzVersion: Joi.string(),
  CardBrand: Joi.string().valid(...Object.keys(CardBrandType)),
  SourceType: Joi.string().valid(...Object.keys(CardSourceType)),
  ReadResult: Joi.string().valid(...Object.keys(CardReadExitType)),
  ErrorCode: Joi.string().allow(""),
  RevisionNumber: Joi.number(),
  HasVasData: Joi.boolean(),
  HasPayData: Joi.boolean(),
  WalletFormat: Joi.string().valid(...Object.keys(WalletType)),
  VasErrorCode: Joi.string().allow(""),
}).meta({ className: "CardStatsRequest" });
