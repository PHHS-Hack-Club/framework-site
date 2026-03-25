import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/app/lib/prisma";
import { getCurrentUser } from "@/app/lib/auth";

// Auto-assign: distribute projects evenly across judges for a given round
export async function POST(req: NextRequest) {
    const user = await getCurrentUser();
    if (!user || user.role !== "ORGANIZER") return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const { roundId } = await req.json();
    if (!roundId) return NextResponse.json({ error: "roundId required" }, { status: 400 });

    const [judges, projects] = await Promise.all([
        prisma.user.findMany({ where: { role: "JUDGE" } }),
        prisma.project.findMany({ include: { team: true } }),
    ]);

    if (judges.length === 0) return NextResponse.json({ error: "No judges found." }, { status: 400 });
    if (projects.length === 0) return NextResponse.json({ error: "No projects found." }, { status: 400 });

    // Delete existing assignments for this round
    await prisma.judgeAssignment.deleteMany({ where: { roundId } });

    // Round-robin assignment
    const assignments: { roundId: string; judgeId: string; projectId: string }[] = [];
    projects.forEach((project, i) => {
        const judge = judges[i % judges.length];
        assignments.push({ roundId, judgeId: judge.id, projectId: project.id });
    });

    // Also assign a 2nd judge per project if we have enough judges
    if (judges.length >= 2) {
        projects.forEach((project, i) => {
            const judge = judges[(i + 1) % judges.length];
            assignments.push({ roundId, judgeId: judge.id, projectId: project.id });
        });
    }

    // Deduplicate (same judge can't be assigned same project twice)
    const unique = Array.from(
        new Map(assignments.map(a => [`${a.judgeId}-${a.projectId}`, a])).values()
    );

    await prisma.judgeAssignment.createMany({ data: unique, skipDuplicates: true });
    return NextResponse.json({ ok: true, count: unique.length });
}
