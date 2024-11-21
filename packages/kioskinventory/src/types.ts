export interface MerchandStatusUpdate {
    MessageId?: string;
    ThinDateUTC?: string;
    ThinReasonCode?: number;
    MerchandStatus?: number;
    Barcode: string;
    UpdateDateTimeUTC: string;
}

export interface UpdateMerchandizingStatusResponse {
    Data: MerchandStatusUpdate[];
}
