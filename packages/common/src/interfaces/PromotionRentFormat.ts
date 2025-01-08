export enum PromotionRentFormat {
    Any,
    Dvd,
    BluRay,
    FourKUhd,
    Game,
}

export const getPromotionRentFormat = (value: PromotionRentFormat): string => {
    return PromotionRentFormat[value];
};
