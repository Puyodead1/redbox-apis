-- CreateTable
CREATE TABLE `statistics` (
    `KioskId` INTEGER NOT NULL,
    `Damaged` VARCHAR(191) NOT NULL,
    `DumpBin` VARCHAR(191) NOT NULL,
    `EmptySlots` VARCHAR(191) NOT NULL,
    `InventoryData` VARCHAR(191) NOT NULL,
    `ProfileData` VARCHAR(191) NOT NULL,
    `RebalancesInKiosk` VARCHAR(191) NOT NULL,
    `ThinDiscs` VARCHAR(191) NOT NULL,
    `TotalDiscs` VARCHAR(191) NOT NULL,
    `UnknownDiscs` VARCHAR(191) NOT NULL,
    `UnknownTitle` VARCHAR(191) NOT NULL,
    `UnmatchedInKiosk` VARCHAR(191) NOT NULL,
    `WrongTitle` VARCHAR(191) NOT NULL,

    UNIQUE INDEX `statistics_KioskId_key`(`KioskId`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
