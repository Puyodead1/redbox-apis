export enum PromotionActionCode {
    Rental = 1,
    Purchase = 2,
}

export const getPromotionActionCode = (value: PromotionActionCode): string => {
    return PromotionActionCode[value];
};
