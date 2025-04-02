import { PrismaClient } from "@prisma/client";

export let connected = false;
export const prisma: PrismaClient = new PrismaClient();

export const getPrisma: () => Promise<PrismaClient> = async () => {
    if (!connected) {
        console.info("Connecting to Prisma");
        await prisma.$connect();
        connected = true;
        console.info("Connected to Prisma");
    }

    return prisma;
};

export const disconnectPrisma = async () => {
    if (connected) {
        console.info("Disconnecting from Prisma");
        await prisma.$disconnect();
        connected = false;
        console.info("Disconnected from Prisma");
    }
};
