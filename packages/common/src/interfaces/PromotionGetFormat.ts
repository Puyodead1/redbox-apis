export enum PromotionGetFormat {
    Any,
    Dvd,
    BluRay,
    FourKUhd,
    Game,
}

export const getPromotionGetFormat = (value: PromotionGetFormat): string => {
    return PromotionGetFormat[value];
};
