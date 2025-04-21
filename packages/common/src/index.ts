export * from "./EncryptionService";
export * from "./HashService";
export * from "./interfaces";
export * from "./KeyService";
export * from "./logger";
export * from "./middleware";
export * from "./types";
export * from "./utils";
export * as loyalty from "./loyalty";

// function to return enum key as string from the enum value
export const getEnumKey = (enumType: any, value: any): string => {
    return enumType[value];
};
