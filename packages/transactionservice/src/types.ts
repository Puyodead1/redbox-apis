import { BaseResponse } from "common";

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

export interface AuthorizeResponse extends BaseResponse {
    MessageId: string;
    Email: string;
    ReferenceNumber: number;
    CustomerProfileLastName: string;
    CustomerProfileFirstName: string;
    Limits: RentalLimit[];
    HasProfile: boolean;
    CustomerProfileNumber: string;
    ConfirmationStatus: ConfirmationStatus;
    AccountNumber: string;
    KioskTransactionSuccess: boolean;
    SubscriptionTransactionSuccess: boolean;
}
