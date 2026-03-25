import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/app/lib/prisma";
import { getCurrentUser } from "@/app/lib/auth";

export async function GET() {
    const user = await getCurrentUser();
    if (!user || user.role !== "ORGANIZER") return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    const awards = await prisma.award.findMany({
        include: { winners: { include: { project: { include: { team: true } } } } },
        orderBy: { createdAt: "asc" },
    });
    return NextResponse.json(awards);
}

export async function POST(req: NextRequest) {
    const user = await getCurrentUser();
    if (!user || user.role !== "ORGANIZER") return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    const { name, description, prize } = await req.json();
    if (!name) return NextResponse.json({ error: "Name required." }, { status: 400 });
    const award = await prisma.award.create({ data: { name, description: description || null, prize: prize || null } });
    return NextResponse.json(award);
}
