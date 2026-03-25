import { NextRequest, NextResponse } from "next/server";
import { getCurrentUser } from "@/app/lib/auth";
import { prisma } from "@/app/lib/prisma";
import { EVENT_CONFIG_ID, getEventConfig } from "@/app/lib/event-config";

export async function GET() {
    const user = await getCurrentUser();
    if (!user || user.role !== "ORGANIZER") {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const config = await getEventConfig();
    return NextResponse.json(config);
}

export async function PUT(req: NextRequest) {
    const user = await getCurrentUser();
    if (!user || user.role !== "ORGANIZER") {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await req.json();
    const themePrompt = typeof body.themePrompt === "string" ? body.themePrompt.trim() : "";
    const themeReleased = Boolean(body.themeReleased);
    const projectSubmissionsOpen = Boolean(body.projectSubmissionsOpen);

    const config = await prisma.eventConfig.upsert({
        where: { id: EVENT_CONFIG_ID },
        update: {
            themePrompt: themePrompt || null,
            themeReleased,
            projectSubmissionsOpen,
        },
        create: {
            id: EVENT_CONFIG_ID,
            themePrompt: themePrompt || null,
            themeReleased,
            projectSubmissionsOpen,
        },
    });

    return NextResponse.json(config);
}
