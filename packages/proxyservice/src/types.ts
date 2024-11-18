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
