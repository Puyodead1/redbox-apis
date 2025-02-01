import { PrismaClient } from "@prisma/client";
import { logger } from "@redbox-apis/common";

export let connected = false;
export const prisma: PrismaClient = new PrismaClient();

export const getPrisma: () => Promise<PrismaClient> = async () => {
    if (!connected) {
        logger.info("Connecting to Prisma");
        await prisma.$connect();
        connected = true;
        logger.info("Connected to Prisma");
    }

    return prisma;
};

export const disconnectPrisma = async () => {
    if (connected) {
        logger.info("Disconnecting from Prisma");
        await prisma.$disconnect();
        connected = false;
        logger.info("Disconnected from Prisma");
    }
};
