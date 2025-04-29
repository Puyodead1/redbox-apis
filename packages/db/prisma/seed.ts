import { PrismaClient } from "@prisma/client";
import chalk from "chalk";
import {
  PromotionActionCode,
  PromotionGetFormat,
  PromotionIntentCode,
  PromotionRentFormat,
  TitleFamily,
  TitleType,
} from "./enums";
import { getEnumKey } from "./utils";

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
      rentFormat: getEnumKey(PromotionRentFormat, PromotionRentFormat.Dvd),
      getFormat: getEnumKey(PromotionGetFormat, PromotionGetFormat.Dvd),
      promotionIntent: getEnumKey(
        PromotionIntentCode,
        PromotionIntentCode.FirstNightDVD,
      ),
      productTypeId: TitleFamily.Movies,
      amount: 0.0,
    },
    {
      code: "BLURAYONME",
      actionType: getEnumKey(PromotionActionCode, PromotionActionCode.Rental),
      allowFullDiscount: true,
      formatIds: [TitleType.Bluray],
      rentFormat: getEnumKey(PromotionRentFormat, PromotionRentFormat.BluRay),
      getFormat: getEnumKey(PromotionGetFormat, PromotionGetFormat.BluRay),
      promotionIntent: getEnumKey(
        PromotionIntentCode,
        PromotionIntentCode.FirstNightBluray,
      ),
      productTypeId: TitleFamily.Movies,
      amount: 0.0,
    },
    {
      code: "4KONME",
      actionType: getEnumKey(PromotionActionCode, PromotionActionCode.Rental),
      allowFullDiscount: true,
      formatIds: [TitleType._4KUHD],
      rentFormat: getEnumKey(PromotionRentFormat, PromotionRentFormat.FourKUhd),
      getFormat: getEnumKey(PromotionGetFormat, PromotionGetFormat.FourKUhd),
      promotionIntent: getEnumKey(
        PromotionIntentCode,
        PromotionIntentCode.FirstNightFreeItem,
      ),
      productTypeId: TitleFamily.Movies,
      amount: 0.0,
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
      rentFormat: getEnumKey(PromotionRentFormat, PromotionRentFormat.Game),
      getFormat: getEnumKey(PromotionGetFormat, PromotionGetFormat.Game),
      promotionIntent: getEnumKey(
        PromotionIntentCode,
        PromotionIntentCode.FirstNightGame,
      ),
      productTypeId: TitleFamily.Games,
      amount: 0.0,
    },
    {
      code: "FREEGAME",
      actionType: getEnumKey(PromotionActionCode, PromotionActionCode.Rental),
      allowFullDiscount: true,
      rentFormat: getEnumKey(PromotionRentFormat, PromotionRentFormat.Any),
      getFormat: getEnumKey(PromotionGetFormat, PromotionGetFormat.Any),
      promotionIntent: getEnumKey(
        PromotionIntentCode,
        PromotionIntentCode.FirstNightGameGameRequired,
      ),
      productTypeId: TitleFamily.All,
      amount: 0.0,
    },
    {
      code: "HALFOFF",
      actionType: getEnumKey(PromotionActionCode, PromotionActionCode.Rental),
      allowFullDiscount: true,
      rentFormat: getEnumKey(PromotionRentFormat, PromotionRentFormat.Any),
      getFormat: getEnumKey(PromotionGetFormat, PromotionGetFormat.Any),
      promotionIntent: getEnumKey(
        PromotionIntentCode,
        PromotionIntentCode.PercentOffCartTotal,
      ),
      productTypeId: TitleFamily.All,
      amount: 0.5,
    },
    {
      code: "ONEDOLLAROFF",
      actionType: getEnumKey(PromotionActionCode, PromotionActionCode.Rental),
      allowFullDiscount: true,
      rentFormat: getEnumKey(PromotionRentFormat, PromotionRentFormat.Any),
      getFormat: getEnumKey(PromotionGetFormat, PromotionGetFormat.Any),
      promotionIntent: getEnumKey(
        PromotionIntentCode,
        PromotionIntentCode.FixedValue,
      ),
      productTypeId: TitleFamily.All,
      amount: 1.0,
    },
    {
      code: "FUCKBILL",
      actionType: getEnumKey(PromotionActionCode, PromotionActionCode.Rental),
      allowFullDiscount: true,
      rentFormat: getEnumKey(PromotionRentFormat, PromotionRentFormat.Any),
      getFormat: getEnumKey(PromotionGetFormat, PromotionGetFormat.Any),
      promotionIntent: getEnumKey(
        PromotionIntentCode,
        PromotionIntentCode.PercentOffCartTotal,
      ),
      productTypeId: TitleFamily.All,
      amount: 1.0,
    },
    {
      code: "AVA2",
      actionType: getEnumKey(PromotionActionCode, PromotionActionCode.Rental),
      allowFullDiscount: true,
      rentFormat: getEnumKey(PromotionRentFormat, PromotionRentFormat.Any),
      getFormat: getEnumKey(PromotionGetFormat, PromotionGetFormat.Any),
      promotionIntent: getEnumKey(
        PromotionIntentCode,
        PromotionIntentCode.FirstNightFreeItem,
      ),
      campaignTitles: {
        Include: true,
        Titles: [310582, 410582],
      },
      productTypeId: TitleFamily.Movies,
      amount: 0.0,
    },
    {
      code: "RENT1GET2",
      actionType: getEnumKey(PromotionActionCode, PromotionActionCode.Rental),
      allowFullDiscount: true,
      rentQty: 1,
      rentFormat: getEnumKey(PromotionRentFormat, PromotionRentFormat.Any),
      getQty: 2,
      getFormat: getEnumKey(PromotionGetFormat, PromotionGetFormat.Any),
      promotionIntent: getEnumKey(
        PromotionIntentCode,
        PromotionIntentCode.RxGx,
      ),
      productTypeId: TitleFamily.Movies,
      amount: 0.0,
    },
    {
      code: "FREEITEM",
      actionType: getEnumKey(PromotionActionCode, PromotionActionCode.Rental),
      allowFullDiscount: true,
      rentFormat: getEnumKey(PromotionRentFormat, PromotionRentFormat.Any),
      getFormat: getEnumKey(PromotionGetFormat, PromotionGetFormat.Any),
      promotionIntent: getEnumKey(
        PromotionIntentCode,
        PromotionIntentCode.FirstNightFreeItem,
      ),
      productTypeId: TitleFamily.Movies,
      amount: 0.0,
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
