import { Joi } from "celebrate";
import { CardBrandType } from "../interfaces/CardBrandType";
import { CardReadExitType } from "../interfaces/CardReadExitType";
import { CardSourceType } from "../interfaces/CardSourceType";
import { WalletType } from "../interfaces/WalletType";

export const CardStatsRequestSchema = Joi.object({
    SessionId: Joi.string().optional(),
    Id: Joi.string().required(),
    KioskId: Joi.number().required(),
    ManufacturerSerialNumber: Joi.string().required(),
    RBAVersion: Joi.string().required(),
    TgzVersion: Joi.string().required(),
    CardBrand: Joi.string()
        .valid(...Object.keys(CardBrandType))
        .required(),
    SourceType: Joi.string()
        .valid(...Object.keys(CardSourceType))
        .required(),
    ReadResult: Joi.string()
        .valid(...Object.keys(CardReadExitType))
        .required(),
    ErrorCode: Joi.string().allow("").required(),
    RevisionNumber: Joi.number().required(),
    HasVasData: Joi.boolean().required(),
    HasPayData: Joi.boolean().required(),
    WalletFormat: Joi.string()
        .valid(...Object.keys(WalletType))
        .required(),
    VasErrorCode: Joi.string().required(),
}).meta({ className: "CardStatsRequest" });
