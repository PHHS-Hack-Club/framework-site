import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/app/lib/prisma";
import { getCurrentUser } from "@/app/lib/auth";
import { sendEmail } from "@/app/lib/mail";

export async function GET(req: NextRequest) {
    const user = await getCurrentUser();
    if (!user || user.role !== "ORGANIZER") return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    const audience = req.nextUrl.searchParams.get("audience") ?? "ALL";
    const emails = await getEmails(audience);
    return NextResponse.json({ emails });
}

async function getEmails(audience: string): Promise<string[]> {
    if (audience === "ALL") {
        const users = await prisma.user.findMany({ where: { role: "HACKER", emailVerified: true } });
        return users.map(u => u.email);
    }
    const apps = await prisma.application.findMany({
        where: { status: audience as never },
        include: { user: true },
    });
    return apps.map(a => a.user.email);
}

export async function POST(req: NextRequest) {
    const user = await getCurrentUser();
    if (!user || user.role !== "ORGANIZER") return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const { audience, subject, body } = await req.json();
    if (!subject || !body) return NextResponse.json({ error: "Subject and body required." }, { status: 400 });

    const emails = await getEmails(audience ?? "ALL");
    if (emails.length === 0) return NextResponse.json({ error: "No recipients found." }, { status: 400 });

    // Keep organizer blasts chunked to reduce burst size on SMTP providers.
    const CHUNK = 50;
    for (let i = 0; i < emails.length; i += CHUNK) {
        const chunk = emails.slice(i, i + CHUNK);
        await sendEmail({
            to: process.env.SMTP_FROM ?? process.env.SMTP_USER,
            bcc: chunk,
            subject,
            html: `
        <body style="background:#131313;color:#e5e2e1;font-family:monospace;padding:40px;">
          <div style="max-width:600px;margin:0 auto;border-left:4px solid #39FF14;padding-left:24px;">
            <h1 style="color:#39FF14;font-size:12px;letter-spacing:4px;">FRAMEWORK_2027</h1>
            <div style="margin-top:24px;white-space:pre-wrap;font-size:14px;line-height:1.7;">${body.replace(/\n/g, "<br/>")}</div>
          </div>
        </body>
      `,
        });
    }

    await prisma.emailLog.create({
        data: { subject, body, sentTo: audience, recipientCount: emails.length, sentById: user.id },
    });

    return NextResponse.json({ ok: true, count: emails.length });
}
