import { Joi } from "celebrate";

export const KioskAlertRequestSchema = Joi.object({
    MessageId: Joi.number().required(),
    KioskId: Joi.number().required(),
    SendToTable: Joi.boolean().optional(),
    UniqueId: Joi.string().required(),
    CreatedOn: Joi.date().required(),
    CreatedOnLocal: Joi.date().required(),
    AlertType: Joi.number().required(),
    SubAlertType: Joi.string().required(),
    AlertMessage: Joi.string().required(),
}).meta({ className: "KioskAlertRequest" });
