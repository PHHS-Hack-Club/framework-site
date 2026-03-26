import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/app/lib/prisma";
import { getCurrentUser } from "@/app/lib/auth";
import { isAdminEmail } from "@/app/lib/site";

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

export async function DELETE(_req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
    const user = await getCurrentUser();
    if (!user || user.role !== "ORGANIZER") return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const { id } = await params;
    const application = await prisma.application.findUnique({
        where: { id },
        select: { userId: true, user: { select: { email: true, role: true } } },
    });

    if (!application) return NextResponse.json({ error: "Application not found" }, { status: 404 });
    if (application.user.role === "ORGANIZER") return NextResponse.json({ error: "Cannot delete an organizer account." }, { status: 403 });
    if (isAdminEmail(application.user.email)) return NextResponse.json({ error: "Cannot delete the head admin." }, { status: 403 });

    await prisma.user.delete({ where: { id: application.userId } });
    return NextResponse.json({ ok: true });
}
