import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/app/lib/prisma";
import { getCurrentUser } from "@/app/lib/auth";

export async function GET(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
    const user = await getCurrentUser();
    if (!user || user.role !== "JUDGE") return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    const { id } = await params;

    const assignment = await prisma.judgeAssignment.findUnique({
        where: { id, judgeId: user.id }, // ensure ownership
        include: {
            project: true,
            score: true,
            round: true,
        },
    });

    if (!assignment) return NextResponse.json({ error: "Not found" }, { status: 404 });
    return NextResponse.json(assignment);
}
