import { NextRequest, NextResponse } from "next/server";
import { getCurrentUser } from "@/app/lib/auth";
import { prisma } from "@/app/lib/prisma";
import { getEventConfig } from "@/app/lib/event-config";

async function getTeamId(userId: string): Promise<string | null> {
    const m = await prisma.teamMember.findFirst({ where: { userId } });
    return m?.teamId ?? null;
}

export async function GET() {
    const user = await getCurrentUser();
    if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    const teamId = await getTeamId(user.id);
    if (!teamId) return NextResponse.json(null);
    const project = await prisma.project.findUnique({ where: { teamId } });
    return NextResponse.json(project);
}

export async function PUT(req: NextRequest) {
    const user = await getCurrentUser();
    if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    const config = await getEventConfig();
    if (!config.projectSubmissionsOpen) {
        return NextResponse.json({ error: "Project submissions are not open yet." }, { status: 403 });
    }
    const teamId = await getTeamId(user.id);
    if (!teamId) return NextResponse.json({ error: "You must be in a team to submit a project." }, { status: 403 });

    const body = await req.json();
    const { name, description, techStack, repoUrl, demoUrl } = body;
    if (!name || !description || !techStack) {
        return NextResponse.json({ error: "Name, description, and tech stack are required." }, { status: 400 });
    }

    const project = await prisma.project.upsert({
        where: { teamId },
        create: { teamId, name, description, techStack, repoUrl: repoUrl || null, demoUrl: demoUrl || null },
        update: { name, description, techStack, repoUrl: repoUrl || null, demoUrl: demoUrl || null },
    });
    return NextResponse.json(project);
}
