import { PrismaClient } from "@prisma/client";
import {
    getEnumKey,
    PromotionActionCode,
    PromotionGetFormat,
    PromotionIntentCode,
    PromotionRentFormat,
    TitleFamily,
    TitleType,
} from "@redbox-apis/common";
const prisma = new PrismaClient();

async function main() {
    const promo1 = await prisma.promoCode.create({
        data: {
            code: "DVDONME",
            actionType: getEnumKey(PromotionActionCode, PromotionActionCode.Rental),
            allowFullDiscount: true,
            formatIds: [TitleType.DVD],
            rentQty: 1,
            rentFormat: getEnumKey(PromotionRentFormat, PromotionRentFormat.Dvd),
            getQty: 1,
            getFormat: getEnumKey(PromotionGetFormat, PromotionGetFormat.Dvd),
            promotionIntent: getEnumKey(PromotionIntentCode, PromotionIntentCode.FirstNightDVD),
            amount: 0,
            campaignTitles: [],
            productTypeId: TitleFamily.Movies,
        },
    });

    const promo2 = await prisma.promoCode.create({
        data: {
            code: "BLURAYONME",
            actionType: getEnumKey(PromotionActionCode, PromotionActionCode.Rental),
            allowFullDiscount: true,
            formatIds: [TitleType.Bluray],
            rentQty: 1,
            rentFormat: getEnumKey(PromotionRentFormat, PromotionRentFormat.BluRay),
            getQty: 1,
            getFormat: getEnumKey(PromotionGetFormat, PromotionGetFormat.BluRay),
            promotionIntent: getEnumKey(PromotionIntentCode, PromotionIntentCode.FirstNightBluray),
            amount: 0,
            campaignTitles: [],
            productTypeId: TitleFamily.Movies,
        },
    });

    const promo3 = await prisma.promoCode.create({
        data: {
            code: "4KONME",
            actionType: getEnumKey(PromotionActionCode, PromotionActionCode.Rental),
            allowFullDiscount: true,
            formatIds: [TitleType._4KUHD],
            rentQty: 1,
            rentFormat: getEnumKey(PromotionRentFormat, PromotionRentFormat.FourKUhd),
            getQty: 1,
            getFormat: getEnumKey(PromotionGetFormat, PromotionGetFormat.FourKUhd),
            promotionIntent: getEnumKey(PromotionIntentCode, PromotionIntentCode.FirstNightFreeItem),
            amount: 0,
            campaignTitles: [],
            productTypeId: TitleFamily.Movies,
        },
    });

    const promo4 = await prisma.promoCode.create({
        data: {
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
            rentQty: 1,
            rentFormat: getEnumKey(PromotionRentFormat, PromotionRentFormat.Game),
            getQty: 1,
            getFormat: getEnumKey(PromotionGetFormat, PromotionGetFormat.Game),
            promotionIntent: getEnumKey(PromotionIntentCode, PromotionIntentCode.FirstNightGame),
            amount: 0,
            campaignTitles: [],
            productTypeId: TitleFamily.Games,
        },
    });

    const promo5 = await prisma.promoCode.create({
        data: {
            code: "FREEGAME",
            actionType: getEnumKey(PromotionActionCode, PromotionActionCode.Rental),
            allowFullDiscount: true,
            formatIds: [TitleType.All],
            rentQty: 2,
            rentFormat: getEnumKey(PromotionRentFormat, PromotionRentFormat.Any),
            getQty: 2,
            getFormat: getEnumKey(PromotionGetFormat, PromotionGetFormat.Any),
            promotionIntent: getEnumKey(PromotionIntentCode, PromotionIntentCode.FirstNightGameGameRequired),
            amount: 0,
            campaignTitles: [],
            productTypeId: TitleFamily.All,
        },
    });

    const promo6 = await prisma.promoCode.create({
        data: {
            code: "HALFOFF",
            actionType: getEnumKey(PromotionActionCode, PromotionActionCode.Rental),
            allowFullDiscount: false,
            formatIds: [TitleType.All],
            rentQty: 5,
            rentFormat: getEnumKey(PromotionRentFormat, PromotionRentFormat.Any),
            getQty: 5,
            getFormat: getEnumKey(PromotionGetFormat, PromotionGetFormat.Any),
            promotionIntent: getEnumKey(PromotionIntentCode, PromotionIntentCode.PercentOffCartTotal),
            amount: 50,
            campaignTitles: [],
            productTypeId: TitleFamily.All,
        },
    });

    const promo7 = await prisma.promoCode.create({
        data: {
            code: "ONEDOLLAROFF",
            actionType: getEnumKey(PromotionActionCode, PromotionActionCode.Rental),
            allowFullDiscount: false,
            formatIds: [TitleType.All],
            rentQty: 5,
            rentFormat: getEnumKey(PromotionRentFormat, PromotionRentFormat.Any),
            getQty: 5,
            getFormat: getEnumKey(PromotionGetFormat, PromotionGetFormat.Any),
            promotionIntent: getEnumKey(PromotionIntentCode, PromotionIntentCode.FixedValue),
            amount: 1.0,
            campaignTitles: [],
            productTypeId: TitleFamily.All,
        },
    });

    const promo8 = await prisma.promoCode.create({
        data: {
            code: "RENT5GET5",
            actionType: getEnumKey(PromotionActionCode, PromotionActionCode.Rental),
            allowFullDiscount: false,
            formatIds: [TitleType.All],
            rentQty: 5,
            rentFormat: getEnumKey(PromotionRentFormat, PromotionRentFormat.Any),
            getQty: 5,
            getFormat: getEnumKey(PromotionGetFormat, PromotionGetFormat.Any),
            promotionIntent: getEnumKey(PromotionIntentCode, PromotionIntentCode.PercentOffCartTotal),
            amount: 100,
            campaignTitles: [],
            productTypeId: TitleFamily.All,
        },
    });

    const promo9 = await prisma.promoCode.create({
        data: {
            code: "AVA",
            actionType: getEnumKey(PromotionActionCode, PromotionActionCode.Rental),
            allowFullDiscount: false,
            formatIds: [TitleType.All],
            rentQty: 5,
            rentFormat: getEnumKey(PromotionRentFormat, PromotionRentFormat.Any),
            getQty: 5,
            getFormat: getEnumKey(PromotionGetFormat, PromotionGetFormat.Any),
            promotionIntent: getEnumKey(PromotionIntentCode, PromotionIntentCode.FirstNightFreeItem),
            amount: 0,
            campaignTitles: [310582],
            productTypeId: TitleFamily.Movies,
        },
    });

    console.log({
        promo1,
        promo2,
        promo3,
        promo4,
        promo5,
        promo6,
        promo7,
        promo8,
        promo9,
    });
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
