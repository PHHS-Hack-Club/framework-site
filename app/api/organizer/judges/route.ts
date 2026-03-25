import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/app/lib/prisma";
import { getCurrentUser, hashPassword } from "@/app/lib/auth";
import { sendEmail } from "@/app/lib/mail";

export async function GET() {
    const user = await getCurrentUser();
    if (!user || user.role !== "ORGANIZER") return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    const judges = await prisma.user.findMany({
        where: { role: "JUDGE" },
        include: { _count: { select: { judgeAssignments: true, scores: true } } },
    });
    return NextResponse.json(judges);
}

export async function POST(req: NextRequest) {
    const user = await getCurrentUser();
    if (!user || user.role !== "ORGANIZER") return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const { email, firstName, lastName } = await req.json();
    if (!email) return NextResponse.json({ error: "Email required." }, { status: 400 });

    const existing = await prisma.user.findUnique({ where: { email } });
    if (existing) {
        if (existing.role === "JUDGE") return NextResponse.json({ error: "Already a judge." }, { status: 409 });
        // Promote to judge
        const updated = await prisma.user.update({ where: { id: existing.id }, data: { role: "JUDGE" } });
        return NextResponse.json(updated);
    }

    // Create new judge user with temporary password
    const tempPassword = Math.random().toString(36).slice(-10) + "!Aa1";
    const passwordHash = await hashPassword(tempPassword);

    const judge = await prisma.user.create({
        data: { email, firstName: firstName ?? null, lastName: lastName ?? null, passwordHash, role: "JUDGE", emailVerified: true },
    });

    // Email credentials
    await sendEmail({
        to: email,
        subject: "JUDGE_ACCESS :: FRAMEWORK 2027",
        html: `<body style="background:#131313;color:#e5e2e1;font-family:monospace;padding:40px;"><div style="max-width:480px;border-left:4px solid #39FF14;padding-left:24px;"><h1 style="color:#39FF14;font-size:12px;letter-spacing:4px;">FRAMEWORK_2027</h1><h2>You've been added as a judge.</h2><p style="color:#baccb0;">Login at <a href="${process.env.APP_URL}/auth/login" style="color:#39FF14;">${process.env.APP_URL}/auth/login</a></p><p>Email: <strong>${email}</strong><br/>Temporary password: <strong style="color:#39FF14;">${tempPassword}</strong></p><p style="color:#3c4b35;font-size:11px;">Please change your password after logging in.</p></div></body>`,
    });

    return NextResponse.json(judge);
}
