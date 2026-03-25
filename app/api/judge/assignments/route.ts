import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/app/lib/prisma";
import { getCurrentUser } from "@/app/lib/auth";

export async function GET() {
    const user = await getCurrentUser();
    if (!user || user.role !== "JUDGE") return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const assignments = await prisma.judgeAssignment.findMany({
        where: { judgeId: user.id },
        include: {
            project: true,
            score: true,
            round: true,
        },
        orderBy: { createdAt: "desc" },
    });
    return NextResponse.json(assignments);
}
