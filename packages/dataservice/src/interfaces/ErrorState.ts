export enum ErrorState {
  None,
  FailedToInitializeConnection,
  FailedToUpdateDevice,
  NoDeviceFound,
  ConnectionError,
  EncryptionError,
  Tampered,
  Unknown,
}
