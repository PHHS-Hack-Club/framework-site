import { NextRequest, NextResponse } from "next/server";
import { getCurrentUser } from "@/app/lib/auth";
import { prisma } from "@/app/lib/prisma";
import { isAdminEmail, normalizeEmail } from "@/app/lib/site";

// Any organizer can list — they need to know who else has access
export async function GET() {
    const user = await getCurrentUser();
    if (!user || user.role !== "ORGANIZER")
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const organizers = await prisma.user.findMany({
        where: { role: "ORGANIZER" },
        select: { id: true, email: true, firstName: true, lastName: true, createdAt: true },
        orderBy: { createdAt: "asc" },
    });

    return NextResponse.json(
        organizers.map((o) => ({ ...o, isHeadAdmin: isAdminEmail(o.email) }))
    );
}

// Only head admin can grant organizer role
export async function POST(req: NextRequest) {
    const user = await getCurrentUser();
    if (!user || user.role !== "ORGANIZER" || !isAdminEmail(user.email))
        return NextResponse.json({ error: "Forbidden" }, { status: 403 });

    const { email } = await req.json();
    if (!email?.trim())
        return NextResponse.json({ error: "Email required" }, { status: 400 });

    const normalized = normalizeEmail(email);
    const target = await prisma.user.findUnique({ where: { email: normalized } });

    if (!target)
        return NextResponse.json(
            { error: "No account found for that email. The user must sign up first." },
            { status: 404 }
        );

    if (target.role === "ORGANIZER")
        return NextResponse.json({ error: "User is already an organizer." }, { status: 409 });

    const updated = await prisma.user.update({
        where: { id: target.id },
        data: { role: "ORGANIZER" },
        select: { id: true, email: true, firstName: true, lastName: true, createdAt: true },
    });

    return NextResponse.json({ ...updated, isHeadAdmin: isAdminEmail(updated.email) });
}

// Only head admin can revoke organizer role
export async function DELETE(req: NextRequest) {
    const user = await getCurrentUser();
    if (!user || user.role !== "ORGANIZER" || !isAdminEmail(user.email))
        return NextResponse.json({ error: "Forbidden" }, { status: 403 });

    const { id } = await req.json();
    if (!id)
        return NextResponse.json({ error: "User ID required" }, { status: 400 });

    const target = await prisma.user.findUnique({ where: { id } });
    if (!target)
        return NextResponse.json({ error: "User not found" }, { status: 404 });

    if (isAdminEmail(target.email))
        return NextResponse.json({ error: "Cannot remove the head admin." }, { status: 403 });

    if (target.id === user.id)
        return NextResponse.json({ error: "Cannot remove yourself." }, { status: 403 });

    await prisma.user.update({ where: { id }, data: { role: "HACKER" } });
    return NextResponse.json({ ok: true });
}
