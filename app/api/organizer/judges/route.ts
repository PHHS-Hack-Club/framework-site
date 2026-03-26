import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/app/lib/prisma";
import { getCurrentUser, generateVerificationToken, hashPassword } from "@/app/lib/auth";
import { sendEmail } from "@/app/lib/mail";
import { normalizeEmail } from "@/app/lib/site";

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

    const normalized = normalizeEmail(email);
    const existing = await prisma.user.findUnique({ where: { email: normalized } });

    if (existing) {
        if (existing.role === "JUDGE") return NextResponse.json({ error: "Already a judge." }, { status: 409 });
        // Promote existing account to judge — they already have a password
        const updated = await prisma.user.update({
            where: { id: existing.id },
            data: { role: "JUDGE" },
            include: { _count: { select: { judgeAssignments: true, scores: true } } },
        });
        await sendJudgeWelcomeExisting(normalized, existing.firstName ?? firstName ?? null);
        return NextResponse.json(updated);
    }

    // New judge — create account with unusable password + invite token
    const token = generateVerificationToken();
    const expiresAt = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000); // 7 days

    const judge = await prisma.user.create({
        data: {
            email: normalized,
            firstName: firstName ?? null,
            lastName: lastName ?? null,
            passwordHash: await hashPassword(crypto.randomUUID()), // unusable until they set their own
            role: "JUDGE",
            emailVerified: true,
            resetToken: token,
            resetTokenExpiresAt: expiresAt,
        },
        include: { _count: { select: { judgeAssignments: true, scores: true } } },
    });

    await sendJudgeInvite(normalized, firstName ?? null, token);
    return NextResponse.json(judge);
}

async function sendJudgeInvite(email: string, firstName: string | null, token: string) {
    const setupUrl = `${process.env.APP_URL}/auth/judge-setup?token=${token}`;
    const name = firstName ? firstName : "there";
    await sendEmail({
        to: email,
        subject: "YOU'VE BEEN INVITED :: FRAMEWORK 2027 JUDGE",
        html: `
<!DOCTYPE html>
<html>
  <body style="background:#131313;color:#e5e2e1;font-family:'JetBrains Mono',monospace;padding:40px;margin:0;">
    <div style="max-width:480px;margin:0 auto;border-left:4px solid #39FF14;padding-left:24px;">
      <p style="color:#39FF14;font-size:12px;letter-spacing:4px;text-transform:uppercase;margin:0 0 4px;">FRAMEWORK_2027</p>
      <p style="color:#baccb0;font-size:11px;letter-spacing:3px;text-transform:uppercase;margin:0 0 28px;">JUDGE_INVITATION</p>
      <h2 style="font-size:22px;margin:0 0 16px;">Hey ${name},</h2>
      <p style="color:#baccb0;line-height:1.7;margin:0 0 28px;">
        You've been invited to judge at <strong style="color:#e5e2e1;">Framework 2027</strong> —
        a same-day software hackathon for Bergen County high school students.
        Click the button below to create your password and access the judge dashboard.
        This link expires in <strong style="color:#39FF14;">7 days</strong>.
      </p>
      <a href="${setupUrl}"
         style="display:inline-block;background:#39FF14;color:#053900;padding:14px 32px;
                text-decoration:none;font-weight:700;letter-spacing:2px;text-transform:uppercase;font-size:13px;">
        SET_PASSWORD &amp; ACCESS_DASHBOARD →
      </a>
      <div style="margin-top:32px;border-left:3px solid #f59e0b;padding:12px 16px;background:rgba(245,158,11,0.08);">
        <p style="color:#f59e0b;font-size:11px;font-weight:700;letter-spacing:2px;margin:0 0 6px;">⚠ EMAIL IN SPAM?</p>
        <p style="color:#d97706;font-size:11px;margin:0;line-height:1.6;">
          If this landed in your <strong>spam or junk folder</strong>, please mark it as
          <strong>Not Spam</strong> so you receive event-day communications.
        </p>
      </div>
      <p style="color:#3c4b35;font-size:11px;margin-top:24px;">
        If you weren't expecting this, you can safely ignore it.
      </p>
    </div>
  </body>
</html>`,
    });
}

async function sendJudgeWelcomeExisting(email: string, firstName: string | null) {
    const loginUrl = `${process.env.APP_URL}/auth/login`;
    const name = firstName ? firstName : "there";
    await sendEmail({
        to: email,
        subject: "JUDGE_ACCESS_GRANTED :: FRAMEWORK 2027",
        html: `
<!DOCTYPE html>
<html>
  <body style="background:#131313;color:#e5e2e1;font-family:'JetBrains Mono',monospace;padding:40px;margin:0;">
    <div style="max-width:480px;margin:0 auto;border-left:4px solid #39FF14;padding-left:24px;">
      <p style="color:#39FF14;font-size:12px;letter-spacing:4px;text-transform:uppercase;margin:0 0 28px;">FRAMEWORK_2027</p>
      <h2 style="font-size:22px;margin:0 0 16px;">Hey ${name},</h2>
      <p style="color:#baccb0;line-height:1.7;margin:0 0 28px;">
        You've been added as a judge for <strong style="color:#e5e2e1;">Framework 2027</strong>.
        Log in with your existing account to access the judge dashboard.
      </p>
      <a href="${loginUrl}"
         style="display:inline-block;background:#39FF14;color:#053900;padding:14px 32px;
                text-decoration:none;font-weight:700;letter-spacing:2px;text-transform:uppercase;font-size:13px;">
        LOGIN → JUDGE_DASHBOARD →
      </a>
    </div>
  </body>
</html>`,
    });
}
