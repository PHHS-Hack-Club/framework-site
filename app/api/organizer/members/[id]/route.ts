import { NextRequest, NextResponse } from "next/server";
import { getCurrentUser } from "@/app/lib/auth";
import { prisma } from "@/app/lib/prisma";
import { isAdminEmail } from "@/app/lib/site";

export async function DELETE(
    _req: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    const user = await getCurrentUser();
    if (!user || user.role !== "ORGANIZER") {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { id } = await params;
    if (id === user.id) {
        return NextResponse.json({ error: "Cannot delete your own account." }, { status: 403 });
    }

    const target = await prisma.user.findUnique({ where: { id } });
    if (!target) return NextResponse.json({ error: "User not found" }, { status: 404 });

    if (isAdminEmail(target.email)) {
        return NextResponse.json({ error: "Cannot delete the head admin." }, { status: 403 });
    }

    await prisma.user.delete({ where: { id } });
    return NextResponse.json({ ok: true });
}
