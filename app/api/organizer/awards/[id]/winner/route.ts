import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/app/lib/prisma";
import { getCurrentUser } from "@/app/lib/auth";

export async function POST(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
    const user = await getCurrentUser();
    if (!user || user.role !== "ORGANIZER") return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    const { id: awardId } = await params;
    const { projectId } = await req.json();
    await prisma.awardWinner.create({ data: { awardId, projectId } });
    return NextResponse.json({ ok: true });
}
