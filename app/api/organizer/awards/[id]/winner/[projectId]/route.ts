import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/app/lib/prisma";
import { getCurrentUser } from "@/app/lib/auth";

export async function DELETE(req: NextRequest, { params }: { params: Promise<{ id: string; projectId: string }> }) {
    const user = await getCurrentUser();
    if (!user || user.role !== "ORGANIZER") return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    const { id: awardId, projectId } = await params;
    await prisma.awardWinner.delete({ where: { awardId_projectId: { awardId, projectId } } });
    return NextResponse.json({ ok: true });
}
