-- CreateTable
CREATE TABLE statistics (
    KioskId INTEGER NOT NULL,
    Damaged TEXT NOT NULL,
    DumpBin TEXT NOT NULL,
    EmptySlots TEXT NOT NULL,
    InventoryData TEXT NOT NULL,
    ProfileData TEXT NOT NULL,
    RebalancesInKiosk TEXT NOT NULL,
    ThinDiscs TEXT NOT NULL,
    TotalDiscs TEXT NOT NULL,
    UnknownDiscs TEXT NOT NULL,
    UnknownTitle TEXT NOT NULL,
    UnmatchedInKiosk TEXT NOT NULL,
    WrongTitle TEXT NOT NULL,

    UNIQUE (KioskId)
);