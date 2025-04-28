import { z } from "zod";

// Base service config
const ServiceConfigSchema = z.object({
    port: z.number(),
    host: z.string(),
});

const DbConfigSchema = z.object({});

export const AppConfigSchema = z.object({
    adServerConfig: ServiceConfigSchema,
    dataServiceConfig: ServiceConfigSchema,
    dbConfig: DbConfigSchema,
    iotCertificateServiceConfig: ServiceConfigSchema,
    kioskInventoryServiceConfig: ServiceConfigSchema,
    proxyServiceConfig: ServiceConfigSchema,
    reelsConfig: ServiceConfigSchema,
    transactionServiceConfig: ServiceConfigSchema,
});

export type AppConfig = z.infer<typeof AppConfigSchema>;
