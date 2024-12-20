-- AlterTable
ALTER TABLE `statistics` ADD COLUMN `FraudCleanSync` VARCHAR(191) NULL,
    ADD COLUMN `MinutesInMaintenance` VARCHAR(191) NULL,
    MODIFY `Damaged` VARCHAR(191) NULL,
    MODIFY `DumpBin` VARCHAR(191) NULL,
    MODIFY `EmptySlots` VARCHAR(191) NULL,
    MODIFY `InventoryData` VARCHAR(191) NULL,
    MODIFY `ProfileData` VARCHAR(191) NULL,
    MODIFY `RebalancesInKiosk` VARCHAR(191) NULL,
    MODIFY `ThinDiscs` VARCHAR(191) NULL,
    MODIFY `TotalDiscs` VARCHAR(191) NULL,
    MODIFY `UnknownDiscs` VARCHAR(191) NULL,
    MODIFY `UnknownTitle` VARCHAR(191) NULL,
    MODIFY `UnmatchedInKiosk` VARCHAR(191) NULL,
    MODIFY `WrongTitle` VARCHAR(191) NULL;