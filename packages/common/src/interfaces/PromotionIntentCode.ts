export enum PromotionIntentCode {
  FirstNightDVD = 1,
  FirstNightBluray = 2,
  FirstNightGame = 3,
  FixedValue = 4,
  PercentOffCartTotal = 5,
  FirstNightGameGameRequired = 6,
  RxGx = 7,
  FirstNightFreeItem = 8,
  MultiNightItem = 9,
}

export const getPromotionIntentCode = (value: PromotionIntentCode): string => {
  return PromotionIntentCode[value];
};
