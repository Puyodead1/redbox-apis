-- CreateTable
CREATE TABLE "DeviceCertificate" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "deviceId" TEXT NOT NULL,
    "certificateId" TEXT NOT NULL,
    "devicePfx" TEXT NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL
);

-- CreateIndex
CREATE UNIQUE INDEX "DeviceCertificate_deviceId_key" ON "DeviceCertificate"("deviceId");
