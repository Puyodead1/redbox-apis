CREATE TABLE statistics_new (
    KioskId INTEGER NOT NULL,
    Damaged TEXT,
    DumpBin TEXT,
    EmptySlots TEXT,
    InventoryData TEXT,
    ProfileData TEXT,
    RebalancesInKiosk TEXT,
    ThinDiscs TEXT,
    TotalDiscs TEXT,
    UnknownDiscs TEXT,
    UnknownTitle TEXT,
    UnmatchedInKiosk TEXT,
    WrongTitle TEXT,
    FraudCleanSync TEXT,
    MinutesInMaintenance TEXT,
    UNIQUE (KioskId)
);

INSERT INTO statistics_new (
    KioskId, Damaged, DumpBin, EmptySlots, InventoryData, ProfileData,
    RebalancesInKiosk, ThinDiscs, TotalDiscs, UnknownDiscs, UnknownTitle,
    UnmatchedInKiosk, WrongTitle
)
SELECT 
    KioskId, Damaged, DumpBin, EmptySlots, InventoryData, ProfileData,
    RebalancesInKiosk, ThinDiscs, TotalDiscs, UnknownDiscs, UnknownTitle,
    UnmatchedInKiosk, WrongTitle
FROM statistics;

DROP TABLE statistics;

ALTER TABLE statistics_new RENAME TO statistics;
