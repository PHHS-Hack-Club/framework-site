import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/app/lib/prisma";
import { getCurrentUser } from "@/app/lib/auth";

export async function GET() {
    const user = await getCurrentUser();
    if (!user || user.role !== "ORGANIZER") return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    const events = await prisma.scheduleEvent.findMany({ orderBy: [{ day: "asc" }, { startTime: "asc" }] });
    return NextResponse.json(events);
}

export async function POST(req: NextRequest) {
    const user = await getCurrentUser();
    if (!user || user.role !== "ORGANIZER") return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    const body = await req.json();
    const ev = await prisma.scheduleEvent.create({ data: { title: body.title, location: body.location || null, day: body.day ?? 1, startTime: body.startTime, endTime: body.endTime || null, tag: body.tag || null } });
    return NextResponse.json(ev);
}
