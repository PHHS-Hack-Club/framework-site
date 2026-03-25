import { NextResponse } from "next/server";
import { getEventConfig } from "@/app/lib/event-config";

export async function GET() {
    const config = await getEventConfig();

    return NextResponse.json({
        themeReleased: config.themeReleased,
        themePrompt: config.themeReleased ? config.themePrompt : null,
        projectSubmissionsOpen: config.projectSubmissionsOpen,
    });
}
