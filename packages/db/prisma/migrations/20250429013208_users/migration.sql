-- CreateTable
CREATE TABLE "User" (
    "cpn" TEXT NOT NULL PRIMARY KEY,
    "signupDate" TEXT NOT NULL,
    "firstName" TEXT,
    "emailAddress" TEXT,
    "phoneNumber" TEXT,
    "password" TEXT NOT NULL,
    "pin" TEXT,
    "hashed" BOOLEAN NOT NULL,
    "loyalty" JSONB NOT NULL,
    "promoCodes" JSONB NOT NULL,
    "disabled" BOOLEAN
);

-- CreateIndex
CREATE UNIQUE INDEX "User_emailAddress_key" ON "User"("emailAddress");

-- CreateIndex
CREATE UNIQUE INDEX "User_phoneNumber_key" ON "User"("phoneNumber");
