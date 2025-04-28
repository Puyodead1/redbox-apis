export enum PromotionActionCode {
  Rental = 1,
  Purchase = 2,
}

export const getPromotionActionCode = (value: PromotionActionCode): string => {
  return PromotionActionCode[value];
};

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

export enum TitleFamily {
  All,
  Movies,
  Games,
}

export enum TitleType {
  All = 0,
  DVD = 1,
  Bluray = 2,
  Xbox360 = 3,
  PS2 = 4,
  PS3 = 5,
  PSP = 6,
  Wii = 7,
  DS = 8,
  PC = 9,
  WiiU = 10,
  PS4 = 11,
  XboxOne = 12,
  DigitalCode = 17,
  NintendoSwitch = 18,
  _4KUHD = 19,
}
