import { BaseResponse } from "@redbox-apis/common";

export enum ConfirmationStatus {
    DontShow,
    SubscribedConfirmed,
    SubscribedNotConfirmed,
    NotSubscribedConfirmed,
    NotSubscribedNotConfirmed,
    NewCustomer,
}

export interface RentalLimit {
    ProductType: string;
    ProductLimit: number;
}

export enum AuthorizeType {
    Authorize,
    GiftCardAuthorize,
}

export enum GiftCardStatus {
    None,
    Unregistered,
    Registered,
}

export interface AuthorizeResponse extends BaseResponse {
    MessageId: string;
    SessionId: string;
    AuthorizeType: AuthorizeType;
    IsOnline: boolean;
    StandAlone: boolean;
    ServerName: string;
    Response: string;
    Email: string;
    ReferenceNumber: number;
    HasProfile: boolean;
    IsRBI: boolean;
    FirstName: string;
    LastName: string;
    ConfirmationStatus: ConfirmationStatus;
    AccountNumber: string;
    CustomerProfileNumber: string;
    StoreNumber: string;
    GiftCardExists: boolean;
    GiftCardStatus: GiftCardStatus;
    GiftCardBalance: number;
    GiftCardMaxDiscs: number;
    GiftCardMaxGames: number;
    KioskTransactionSuccess: boolean;
    SubscriptionTransactionSuccess: boolean;

    // CustomerProfileLastName: string;
    // CustomerProfileFirstName: string;
    // Limits: RentalLimit[];
}
