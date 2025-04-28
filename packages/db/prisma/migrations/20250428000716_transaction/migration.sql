-- CreateTable
CREATE TABLE "Transaction" (
    "transactionId" TEXT NOT NULL PRIMARY KEY,
    "email" TEXT,
    "kioskId" INTEGER,
    "transactionDate" TEXT,
    "customerProfileNumber" TEXT,
    "items" JSONB NOT NULL,
    "discounts" JSONB NOT NULL,
    "cardInformation" JSONB NOT NULL
);
