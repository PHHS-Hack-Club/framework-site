import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/app/lib/prisma";
import { getCurrentUser } from "@/app/lib/auth";

export async function POST(req: NextRequest) {
    const user = await getCurrentUser();
    if (!user || user.role !== "JUDGE") return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const { assignmentId, innovation, technicalDepth, designUX, impact, comments } = await req.json();

    // Validate scores
    for (const [k, v] of Object.entries({ innovation, technicalDepth, designUX, impact })) {
        if (typeof v !== "number" || v < 1 || v > 5) {
            return NextResponse.json({ error: `Invalid score for ${k}. Must be 1–5.` }, { status: 400 });
        }
    }

    // Verify this assignment belongs to the judge
    const assignment = await prisma.judgeAssignment.findUnique({ where: { id: assignmentId } });
    if (!assignment || assignment.judgeId !== user.id) {
        return NextResponse.json({ error: "Assignment not found." }, { status: 404 });
    }

    // Check round is still open
    const round = await prisma.judgingRound.findUnique({ where: { id: assignment.roundId } });
    if (!round || round.status !== "OPEN") {
        return NextResponse.json({ error: "This judging round is not open." }, { status: 403 });
    }

    const score = await prisma.score.upsert({
        where: { assignmentId },
        create: { assignmentId, judgeId: user.id, innovation, technicalDepth, designUX, impact, comments: comments ?? null },
        update: { innovation, technicalDepth, designUX, impact, comments: comments ?? null },
    });

    return NextResponse.json(score);
}
