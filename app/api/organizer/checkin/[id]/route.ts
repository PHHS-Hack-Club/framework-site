import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/app/lib/prisma";
import { getCurrentUser } from "@/app/lib/auth";

export async function PATCH(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
    const user = await getCurrentUser();
    if (!user || user.role !== "ORGANIZER") return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    const { id } = await params;
    const { checkedIn } = await req.json();
    const app = await prisma.application.update({
        where: { userId: id },
        data: { checkedIn, checkedInAt: checkedIn ? new Date() : null },
    });
    return NextResponse.json(app);
}
