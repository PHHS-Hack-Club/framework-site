import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/app/lib/prisma";
import { getCurrentUser } from "@/app/lib/auth";

export async function GET() {
    const user = await getCurrentUser();
    if (!user || user.role !== "ORGANIZER") return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    const rounds = await prisma.judgingRound.findMany({
        include: { _count: { select: { assignments: true } } },
        orderBy: { createdAt: "asc" },
    });
    return NextResponse.json(rounds);
}

export async function POST(req: NextRequest) {
    const user = await getCurrentUser();
    if (!user || user.role !== "ORGANIZER") return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    const { name } = await req.json();
    const round = await prisma.judgingRound.create({ data: { name } });
    return NextResponse.json(round);
}
