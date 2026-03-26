import { NextRequest, NextResponse } from "next/server";
import { getCurrentUser } from "@/app/lib/auth";
import { prisma } from "@/app/lib/prisma";
import type { ContactStatus } from "@prisma/client";

const ALLOWED_STATUSES = new Set<ContactStatus>(["NEW", "RESPONDED", "ARCHIVED"]);

export async function PATCH(
    req: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    const user = await getCurrentUser();
    if (!user || user.role !== "ORGANIZER") {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { id } = await params;
    const { status } = await req.json();

    if (!ALLOWED_STATUSES.has(status)) {
        return NextResponse.json({ error: "Invalid status." }, { status: 400 });
    }

    const updated = await prisma.contactMessage.update({
        where: { id },
        data: {
            status,
            respondedAt: status === "RESPONDED" ? new Date() : undefined,
        },
    });

    return NextResponse.json(updated);
}

export async function DELETE(
    _req: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    const user = await getCurrentUser();
    if (!user || user.role !== "ORGANIZER") {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { id } = await params;
    await prisma.contactMessage.delete({ where: { id } });
    return NextResponse.json({ ok: true });
}
