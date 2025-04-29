-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_PromoCode" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "code" TEXT NOT NULL,
    "amount" REAL NOT NULL,
    "promotionIntent" TEXT NOT NULL,
    "rentQty" INTEGER,
    "rentFormat" TEXT NOT NULL,
    "getQty" INTEGER,
    "getFormat" TEXT NOT NULL,
    "campaignTitles" JSONB,
    "productTypeId" INTEGER,
    "formatIds" JSONB,
    "actionType" TEXT NOT NULL,
    "allowFullDiscount" BOOLEAN NOT NULL,
    "defaultPromo" JSONB,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL
);
INSERT INTO "new_PromoCode" ("actionType", "allowFullDiscount", "amount", "campaignTitles", "code", "createdAt", "defaultPromo", "formatIds", "getFormat", "getQty", "id", "productTypeId", "promotionIntent", "rentFormat", "rentQty", "updatedAt") SELECT "actionType", "allowFullDiscount", "amount", "campaignTitles", "code", "createdAt", "defaultPromo", "formatIds", "getFormat", "getQty", "id", "productTypeId", "promotionIntent", "rentFormat", "rentQty", "updatedAt" FROM "PromoCode";
DROP TABLE "PromoCode";
ALTER TABLE "new_PromoCode" RENAME TO "PromoCode";
CREATE UNIQUE INDEX "PromoCode_code_key" ON "PromoCode"("code");
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
