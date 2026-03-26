import { NextResponse } from "next/server";
import { getCurrentUser } from "@/app/lib/auth";
import { prisma } from "@/app/lib/prisma";

export async function GET() {
    const user = await getCurrentUser();
    if (!user || user.role !== "ORGANIZER") {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const contacts = await prisma.contactMessage.findMany({
        include: {
            responses: {
                orderBy: { sentAt: "desc" },
            },
        },
        orderBy: [
            { status: "asc" },
            { createdAt: "desc" },
        ],
    });

    return NextResponse.json(contacts);
}
