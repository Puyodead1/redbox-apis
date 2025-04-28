import { PrismaClient } from "@prisma/client";
import chalk from "chalk";
import { getEnumKey } from "./utils";
import {
  PromotionActionCode,
  PromotionGetFormat,
  PromotionIntentCode,
  PromotionRentFormat,
  TitleFamily,
  TitleType,
} from "./enums";

const prisma = new PrismaClient();

async function upsertPromo(promo: any) {
  const existing = await prisma.promoCode.findUnique({
    where: { code: promo.code },
  });

  if (existing) {
    await prisma.promoCode.update({
      where: { code: promo.code },
      data: promo,
    });
    console.log(chalk.yellow(`🛠️  Updated promo: ${promo.code}`));
  } else {
    await prisma.promoCode.create({
      data: promo,
    });
    console.log(chalk.green(`✅ Created promo: ${promo.code}`));
  }
}

async function main() {
  const promos = [
    {
      code: "DVDONME",
      actionType: getEnumKey(PromotionActionCode, PromotionActionCode.Rental),
      allowFullDiscount: true,
      formatIds: [TitleType.DVD],
      rentQty: 0,
      rentFormat: getEnumKey(PromotionRentFormat, PromotionRentFormat.Dvd),
      getQty: 0,
      getFormat: getEnumKey(PromotionGetFormat, PromotionGetFormat.Dvd),
      promotionIntent: getEnumKey(PromotionIntentCode, PromotionIntentCode.FirstNightDVD),
      amount: 0,
      campaignTitles: [],
      productTypeId: TitleFamily.Movies,
    },
    {
      code: "BLURAYONME",
      actionType: getEnumKey(PromotionActionCode, PromotionActionCode.Rental),
      allowFullDiscount: true,
      formatIds: [TitleType.Bluray],
      rentQty: 0,
      rentFormat: getEnumKey(PromotionRentFormat, PromotionRentFormat.BluRay),
      getQty: 0,
      getFormat: getEnumKey(PromotionGetFormat, PromotionGetFormat.BluRay),
      promotionIntent: getEnumKey(PromotionIntentCode, PromotionIntentCode.FirstNightBluray),
      amount: 0,
      campaignTitles: [],
      productTypeId: TitleFamily.Movies,
    },
    {
      code: "4KONME",
      actionType: getEnumKey(PromotionActionCode, PromotionActionCode.Rental),
      allowFullDiscount: true,
      formatIds: [TitleType._4KUHD],
      rentQty: 0,
      rentFormat: getEnumKey(PromotionRentFormat, PromotionRentFormat.FourKUhd),
      getQty: 0,
      getFormat: getEnumKey(PromotionGetFormat, PromotionGetFormat.FourKUhd),
      promotionIntent: getEnumKey(PromotionIntentCode, PromotionIntentCode.FirstNightFreeItem),
      amount: 0,
      campaignTitles: [],
      productTypeId: TitleFamily.Movies,
    },
    {
      code: "GAMEONME",
      actionType: getEnumKey(PromotionActionCode, PromotionActionCode.Rental),
      allowFullDiscount: true,
      formatIds: [
        getEnumKey(TitleType, TitleType.DS),
        getEnumKey(TitleType, TitleType.NintendoSwitch),
        getEnumKey(TitleType, TitleType.PC),
        getEnumKey(TitleType, TitleType.PS2),
        getEnumKey(TitleType, TitleType.PS3),
        getEnumKey(TitleType, TitleType.PS4),
        getEnumKey(TitleType, TitleType.PSP),
        getEnumKey(TitleType, TitleType.Wii),
        getEnumKey(TitleType, TitleType.WiiU),
        getEnumKey(TitleType, TitleType.Xbox360),
        getEnumKey(TitleType, TitleType.XboxOne),
      ],
      rentQty: 0,
      rentFormat: getEnumKey(PromotionRentFormat, PromotionRentFormat.Game),
      getQty: 0,
      getFormat: getEnumKey(PromotionGetFormat, PromotionGetFormat.Game),
      promotionIntent: getEnumKey(PromotionIntentCode, PromotionIntentCode.FirstNightGame),
      amount: 0,
      campaignTitles: [],
      productTypeId: TitleFamily.Games,
    },
    {
      code: "FREEGAME",
      actionType: getEnumKey(PromotionActionCode, PromotionActionCode.Rental),
      allowFullDiscount: true,
      formatIds: [TitleType.All],
      rentQty: 0,
      rentFormat: getEnumKey(PromotionRentFormat, PromotionRentFormat.Any),
      getQty: 0,
      getFormat: getEnumKey(PromotionGetFormat, PromotionGetFormat.Any),
      promotionIntent: getEnumKey(PromotionIntentCode, PromotionIntentCode.FirstNightGameGameRequired),
      amount: 0,
      campaignTitles: [],
      productTypeId: TitleFamily.All,
    },
    {
      code: "HALFOFF",
      actionType: getEnumKey(PromotionActionCode, PromotionActionCode.Rental),
      allowFullDiscount: true,
      formatIds: [TitleType.All],
      rentQty: 0,
      rentFormat: getEnumKey(PromotionRentFormat, PromotionRentFormat.Any),
      getQty: 0,
      getFormat: getEnumKey(PromotionGetFormat, PromotionGetFormat.Any),
      promotionIntent: getEnumKey(PromotionIntentCode, PromotionIntentCode.PercentOffCartTotal),
      amount: 50,
      campaignTitles: [],
      productTypeId: TitleFamily.All,
    },
    {
      code: "ONEDOLLAROFF",
      actionType: getEnumKey(PromotionActionCode, PromotionActionCode.Rental),
      allowFullDiscount: true,
      formatIds: [TitleType.All],
      rentQty: 0,
      rentFormat: getEnumKey(PromotionRentFormat, PromotionRentFormat.Any),
      getQty: 0,
      getFormat: getEnumKey(PromotionGetFormat, PromotionGetFormat.Any),
      promotionIntent: getEnumKey(PromotionIntentCode, PromotionIntentCode.FixedValue),
      amount: 1.0,
      campaignTitles: [],
      productTypeId: TitleFamily.All,
    },
    {
      code: "FREESHIT",
      actionType: getEnumKey(PromotionActionCode, PromotionActionCode.Rental),
      allowFullDiscount: true,
      formatIds: [TitleType.All],
      rentQty: 0,
      rentFormat: getEnumKey(PromotionRentFormat, PromotionRentFormat.Any),
      getQty: 0,
      getFormat: getEnumKey(PromotionGetFormat, PromotionGetFormat.Any),
      promotionIntent: getEnumKey(PromotionIntentCode, PromotionIntentCode.PercentOffCartTotal),
      amount: 100,
      campaignTitles: [],
      productTypeId: TitleFamily.All,
    },
    {
      code: "AVA2",
      actionType: getEnumKey(PromotionActionCode, PromotionActionCode.Rental),
      allowFullDiscount: true,
      formatIds: [TitleType.All],
      rentQty: 0,
      rentFormat: getEnumKey(PromotionRentFormat, PromotionRentFormat.Any),
      getQty: 0,
      getFormat: getEnumKey(PromotionGetFormat, PromotionGetFormat.Any),
      promotionIntent: getEnumKey(PromotionIntentCode, PromotionIntentCode.FirstNightFreeItem),
      amount: 0,
      campaignTitles: [310582, 410582],
      productTypeId: TitleFamily.Movies,
    },
    {
      code: "RENT1GET2",
      actionType: getEnumKey(PromotionActionCode, PromotionActionCode.Rental),
      allowFullDiscount: true,
      formatIds: [TitleType.All],
      rentQty: 1,
      rentFormat: getEnumKey(PromotionRentFormat, PromotionRentFormat.Any),
      getQty: 2,
      getFormat: getEnumKey(PromotionGetFormat, PromotionGetFormat.Any),
      promotionIntent: getEnumKey(PromotionIntentCode, PromotionIntentCode.RxGx),
      amount: 0,
      campaignTitles: [],
      productTypeId: TitleFamily.Movies,
    },
    {
      code: "FREEITEM",
      actionType: getEnumKey(PromotionActionCode, PromotionActionCode.Rental),
      allowFullDiscount: true,
      formatIds: [TitleType.All],
      rentQty: 0,
      rentFormat: getEnumKey(PromotionRentFormat, PromotionRentFormat.Any),
      getQty: 0,
      getFormat: getEnumKey(PromotionGetFormat, PromotionGetFormat.Any),
      promotionIntent: getEnumKey(PromotionIntentCode, PromotionIntentCode.FirstNightFreeItem),
      amount: 0,
      campaignTitles: [],
      productTypeId: TitleFamily.Movies,
    },
    {
      code: "FUCKBILL",
      actionType: getEnumKey(PromotionActionCode, PromotionActionCode.Rental),
      allowFullDiscount: true,
      formatIds: [TitleType.All],
      rentQty: 0,
      rentFormat: getEnumKey(PromotionRentFormat, PromotionRentFormat.Any),
      getQty: 0,
      getFormat: getEnumKey(PromotionGetFormat, PromotionGetFormat.Any),
      promotionIntent: getEnumKey(PromotionIntentCode, PromotionIntentCode.PercentOffCartTotal),
      amount: 200,
      campaignTitles: [],
      productTypeId: TitleFamily.All,
    },
  ];

  for (const promo of promos) {
    await upsertPromo(promo);
  }

  console.log(chalk.green("\n✅ Promo seeding complete.\n"));
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });