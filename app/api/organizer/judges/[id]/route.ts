import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/app/lib/prisma";
import { getCurrentUser } from "@/app/lib/auth";

export async function DELETE(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
    const user = await getCurrentUser();
    if (!user || user.role !== "ORGANIZER") return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    const { id } = await params;
    // Demote to HACKER instead of delete, so their account persists
    await prisma.user.update({ where: { id }, data: { role: "HACKER" } });
    return NextResponse.json({ ok: true });
}
