export enum EKioskClientServiceEventType {
    ServiceStarting = "ServiceStarting",
    ServiceStarted = "ServiceStarted",
    ServiceStopping = "ServiceStopping",
    ServiceStopped = "ServiceStopped",
}

export interface IKioskClientServiceEvent {
    KioskId: string;
    AssemblyVersion: string;
    EventType: EKioskClientServiceEventType;
    EventTime: string;
    EventTimeUtc: string;
}

export enum EKioskAlertType {}

export interface IKioskAlert {
    AlertMessage: string;
    AlertType: EKioskAlertType;
    CreatedOn: string;
    CreatedOnLocal: string;
    KioskId: string;
    MessageId: string;
    SubAlertType: string;
    UniqueId: string;
}
