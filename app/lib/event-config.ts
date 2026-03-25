import { prisma } from "./prisma";

export const EVENT_CONFIG_ID = "main";

export async function getEventConfig() {
    return prisma.eventConfig.upsert({
        where: { id: EVENT_CONFIG_ID },
        update: {},
        create: { id: EVENT_CONFIG_ID },
    });
}
