import { Joi } from "celebrate";

export const KioskCampaignsRequestSchema = Joi.object({
    LastSyncTime: Joi.date().iso().optional(),
}).meta({ className: "KioskCampaignsRequest" });
