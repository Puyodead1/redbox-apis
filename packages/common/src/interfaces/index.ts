export * from "./generated";
export * from "./PromotionActionCode";
export * from "./PromotionGetFormat";
export * from "./PromotionIntentCode";
export * from "./PromotionRentFormat";
export * from "./TitleFamily";
export * from "./TitleType";

export interface BaseResponse {
  MessageId: string;
  Success: boolean;
  Errors: string[];
}
