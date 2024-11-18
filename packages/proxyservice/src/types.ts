export interface IInstallerModelState {
    Id: number;
    Description: string;
}

export interface IInstallerModelBanner {
    Id: number;
    Name: string;
}

export interface IInstallerModelPendingKiosk {
    Id: number;
    Address: string;
    City: string;
    State: string;
    ZipCode: string;
    DueTime: string;
    MarketName: string;
    KaseyaMarketName: string;
}

export interface IPlanogramInfo {
    Name: string;
    StartDate: string; // DateTime
    FileType: string;
    Filename: string;
    LastUpdateUtc: string; // DateTime
    PresignedUrl: string;
}

export enum ELocationType {
    Outdoor = 0,
    Indoor = 1,
}

export interface INearbyKiosk {
    KioskId: number;
    IsDual: boolean;
    Label?: string; // A, or B
    LocationName: string;
    LocationType: ELocationType;
    Address: string;
    DistanceMiles: number;
}

// ---- Responses ----

export interface IPendingStatesResponse {
    States: IInstallerModelState[];
}

export interface IPendingBannersResponse {
    Banners: IInstallerModelBanner[];
}

export interface IPendingKiosksResponse {
    PendingKiosks: IInstallerModelPendingKiosk[];
}

export interface IGetPlanogramsResponse {
    Planograms: IPlanogramInfo[];
}

export interface INearbyKiosksResponse {
    MessageId?: string; // GUID
    Kiosks: INearbyKiosk[];
}
