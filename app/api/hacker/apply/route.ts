import { NextRequest, NextResponse } from "next/server";
import { getCurrentUser } from "@/app/lib/auth";
import { prisma } from "@/app/lib/prisma";

export async function POST(req: NextRequest) {
    const user = await getCurrentUser();
    if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const existing = await prisma.application.findUnique({ where: { userId: user.id } });
    if (existing) return NextResponse.json({ error: "Application already submitted." }, { status: 409 });

    const body = await req.json();
    const { school, grade, github, experience, dietary, tshirt, shortAnswer, schoolIdPath } = body;

    if (!school || !grade || !github || !experience || !tshirt || !shortAnswer) {
        return NextResponse.json({ error: "All required fields must be filled." }, { status: 400 });
    }
    if (!schoolIdPath) {
        return NextResponse.json({ error: "School ID photo is required." }, { status: 400 });
    }

    await prisma.application.create({
        data: {
            userId: user.id,
            school,
            grade,
            github: github.trim(),
            experience,
            dietary: dietary || null,
            tshirt,
            shortAnswer,
            schoolIdPath,
        },
    });

    return NextResponse.json({ ok: true });
}

export async function GET() {
    const user = await getCurrentUser();
    if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    const app = await prisma.application.findUnique({ where: { userId: user.id } });
    return NextResponse.json(app);
}
