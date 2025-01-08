import DefaultPromo from "./DefaultPromo";
import { DiscountValidationCampaignTitlesResult } from "./DiscountValidationCampaignTitlesResult";

export default interface PromoCodeValidationResponse {
    MessageId: string;
    KioskId: number;
    Error: string;
    Amount: number;
    PromotionIntentCode: string;
    RentQty?: number;
    RentFormat: string;
    GetQty?: number;
    GetFormat: string;
    CampaignTitles: DiscountValidationCampaignTitlesResult[];
    ProductTypeId?: number;
    FormatIds: number[];
    ActionType: string;
    AllowFullDiscount: boolean;
    DefaultPromo: DefaultPromo;
}
