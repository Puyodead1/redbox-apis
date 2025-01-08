/*
  Warnings:

  - You are about to drop the `statistics` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropTable
PRAGMA foreign_keys=off;
DROP TABLE "statistics";
PRAGMA foreign_keys=on;

-- CreateTable
CREATE TABLE "Statistics" (
    "KioskId" INTEGER NOT NULL,
    "Damaged" TEXT,
    "DumpBin" TEXT,
    "EmptySlots" TEXT,
    "InventoryData" TEXT,
    "ProfileData" TEXT,
    "RebalancesInKiosk" TEXT,
    "ThinDiscs" TEXT,
    "TotalDiscs" TEXT,
    "UnknownDiscs" TEXT,
    "UnknownTitle" TEXT,
    "UnmatchedInKiosk" TEXT,
    "WrongTitle" TEXT,
    "MinutesInMaintenance" TEXT,
    "FraudCleanSync" TEXT
);

-- CreateTable
CREATE TABLE "PromoCode" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "code" TEXT NOT NULL,
    "amount" REAL NOT NULL,
    "promotionIntent" TEXT NOT NULL,
    "rentQty" INTEGER,
    "rentFormat" TEXT NOT NULL,
    "getQty" INTEGER,
    "getFormat" TEXT NOT NULL,
    "campaignTitles" JSONB NOT NULL,
    "productTypeId" INTEGER,
    "formatIds" JSONB NOT NULL,
    "actionType" TEXT NOT NULL,
    "allowFullDiscount" BOOLEAN NOT NULL,
    "defaultPromo" JSONB,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL
);

-- CreateIndex
CREATE UNIQUE INDEX "Statistics_KioskId_key" ON "Statistics"("KioskId");

-- CreateIndex
CREATE UNIQUE INDEX "PromoCode_code_key" ON "PromoCode"("code");
