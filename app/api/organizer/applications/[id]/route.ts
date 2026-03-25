import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/app/lib/prisma";
import { getCurrentUser } from "@/app/lib/auth";

export async function PATCH(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
    const user = await getCurrentUser();
    if (!user || user.role !== "ORGANIZER") return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    const { id } = await params;
    const { status, reviewNote } = await req.json();
    const updated = await prisma.application.update({
        where: { id },
        data: { status, reviewNote },
    });
    return NextResponse.json(updated);
}
