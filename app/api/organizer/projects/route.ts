import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/app/lib/prisma";
import { getCurrentUser } from "@/app/lib/auth";

export async function GET() {
    const user = await getCurrentUser();
    if (!user || user.role !== "ORGANIZER") return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    const projects = await prisma.project.findMany({
        include: { team: true, _count: { select: { judgeAssignments: true } } },
    });
    return NextResponse.json(projects);
}
