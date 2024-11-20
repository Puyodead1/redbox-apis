import { BaseResponse } from "common";

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
    Outdoor,
    Indoor,
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

export enum EInCartType {
    NotSet,
    StartScreen,
    InCart,
}

export interface IInCartDetails {
    CampaignInCartId: number;
    InCartType: EInCartType;
    Amount?: number;
    PromoCode: string;
    ExcludeTitles: string[];
}

export enum EControlType {
    NotSet,
    StartAsset,
    Carousel,
}

export interface IAsset {
    Id: number;
    Name: string;
    Url: string;
    FullPath: string;
}

export enum EAssetTarget {
    ProductGroupId,
    PromoCode,
    None,
    BrowseFilter,
}

export interface IControl {
    ControlId?: number;
    DisplayDuration?: number;
    ControlType: EControlType;
    Asset?: IAsset; // only if StartAsset
    Target?: EAssetTarget; // only if StartAsset
    TargetValue?: string; // only if StartAsset
    Order?: number; // only if StartAsset
    ShowPressToStart?: boolean; // only if StartAsset
    IncludeIfNoInventory?: boolean; // only if StartAsset
    MaxTitles?: number; // only if Carousel
}

export interface IStartScreenDetails {
    Controls: IControl[];
}

// ---- Responses ----

export interface IPendingStatesResponse extends BaseResponse {
    States: IInstallerModelState[];
}

export interface IPendingBannersResponse extends BaseResponse {
    Banners: IInstallerModelBanner[];
}

export interface IPendingKiosksResponse extends BaseResponse {
    PendingKiosks: IInstallerModelPendingKiosk[];
}

export interface IGetPlanogramsResponse extends BaseResponse {
    Planograms: IPlanogramInfo[];
}

export interface INearbyKiosksResponse extends BaseResponse {
    Kiosks: INearbyKiosk[];
}

export interface IKioskCampaignsResponse extends BaseResponse {
    LastSyncTime?: string; // DateTime
    InCarts: IInCartDetails[];
    StartScreens: IStartScreenDetails[];
}
