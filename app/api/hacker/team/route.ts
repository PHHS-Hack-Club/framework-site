import { NextRequest, NextResponse } from "next/server";
import { getCurrentUser } from "@/app/lib/auth";
import { prisma } from "@/app/lib/prisma";
import { getEventConfig } from "@/app/lib/event-config";

export async function GET() {
    const user = await getCurrentUser();
    if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const membership = await prisma.teamMember.findFirst({
        where: { userId: user.id },
        include: { team: { include: { members: { include: { user: true } } } } },
    });
    return NextResponse.json(membership?.team ?? null);
}

export async function POST(req: NextRequest) {
    const user = await getCurrentUser();
    if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    const config = await getEventConfig();

    if (!config.projectSubmissionsOpen) {
        return NextResponse.json({ error: "Team creation opens when project submissions go live." }, { status: 403 });
    }

    // Check accepted
    const app = await prisma.application.findUnique({ where: { userId: user.id } });
    if (!app || app.status !== "ACCEPTED") {
        return NextResponse.json({ error: "Only accepted hackers can join/create teams." }, { status: 403 });
    }

    const existing = await prisma.teamMember.findFirst({ where: { userId: user.id } });
    if (existing) return NextResponse.json({ error: "Already in a team." }, { status: 409 });

    const body = await req.json();

    if (body.action === "create") {
        if (!body.name) return NextResponse.json({ error: "Team name required." }, { status: 400 });
        const team = await prisma.team.create({
            data: {
                name: body.name,
                leaderId: user.id,
                members: { create: { userId: user.id } },
            },
            include: { members: { include: { user: true } } },
        });
        return NextResponse.json(team);
    }

    if (body.action === "join") {
        const code = (body.joinCode as string).toLowerCase();
        const team = await prisma.team.findFirst({ where: { joinCode: { startsWith: code } } });
        if (!team) return NextResponse.json({ error: "Invalid join code." }, { status: 404 });
        if ((await prisma.teamMember.count({ where: { teamId: team.id } })) >= 4) {
            return NextResponse.json({ error: "Team is full (max 4 members)." }, { status: 409 });
        }
        await prisma.teamMember.create({ data: { teamId: team.id, userId: user.id } });
        const updated = await prisma.team.findUnique({ where: { id: team.id }, include: { members: { include: { user: true } } } });
        return NextResponse.json(updated);
    }

    return NextResponse.json({ error: "Unknown action." }, { status: 400 });
}

export async function DELETE() {
    const user = await getCurrentUser();
    if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    const config = await getEventConfig();
    if (!config.projectSubmissionsOpen) {
        return NextResponse.json({ error: "Team changes are locked until project submissions open." }, { status: 403 });
    }
    await prisma.teamMember.deleteMany({ where: { userId: user.id } });
    return NextResponse.json({ ok: true });
}
