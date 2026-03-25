import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/app/lib/prisma";
import { getCurrentUser } from "@/app/lib/auth";

async function requireOrganizer() {
    const user = await getCurrentUser();
    if (!user || user.role !== "ORGANIZER") return null;
    return user;
}

export async function GET(req: NextRequest) {
    if (!await requireOrganizer()) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    const status = req.nextUrl.searchParams.get("status");
    const apps = await prisma.application.findMany({
        where: status ? { status: status as never } : undefined,
        include: { user: true },
        orderBy: { createdAt: "desc" },
    });
    return NextResponse.json(apps);
}
