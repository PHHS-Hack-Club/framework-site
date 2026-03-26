import { NextRequest, NextResponse } from "next/server";
import { getCurrentUser } from "@/app/lib/auth";
import { prisma } from "@/app/lib/prisma";
import { sendEmail } from "@/app/lib/mail";

const APP_URL = process.env.APP_URL ?? "http://localhost:2027";

function escapeHtml(value: string) {
    return value
        .replaceAll("&", "&amp;")
        .replaceAll("<", "&lt;")
        .replaceAll(">", "&gt;")
        .replaceAll('"', "&quot;")
        .replaceAll("'", "&#39;");
}

function nl2br(value: string) {
    return escapeHtml(value).replaceAll("\n", "<br />");
}

export async function POST(
    req: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    const user = await getCurrentUser();
    if (!user || user.role !== "ORGANIZER") {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { id } = await params;
    const { subject, body } = await req.json();

    if (!subject?.trim() || !body?.trim()) {
        return NextResponse.json({ error: "Subject and body are required." }, { status: 400 });
    }

    const contact = await prisma.contactMessage.findUnique({
        where: { id },
    });

    if (!contact) {
        return NextResponse.json({ error: "Contact message not found." }, { status: 404 });
    }

    await sendEmail({
        to: contact.email,
        replyTo: process.env.CONTACT_EMAIL_TO ?? undefined,
        subject: subject.trim(),
        html: `
          <body style="background:#131313;color:#e5e2e1;font-family:'JetBrains Mono',monospace;padding:40px;">
            <div style="max-width:620px;margin:0 auto;border-left:4px solid #39FF14;padding-left:24px;">
              <h1 style="color:#39FF14;font-size:14px;letter-spacing:4px;text-transform:uppercase;margin-bottom:8px;">
                FRAMEWORK_2027
              </h1>
              <h2 style="font-size:24px;margin-bottom:16px;">${escapeHtml(subject.trim())}</h2>
              <div style="color:#baccb0;line-height:1.8;">
                ${nl2br(body.trim())}
              </div>
              <div style="margin-top:28px;border-top:1px solid #3c4b35;padding-top:24px;">
                <p style="color:#baccb0;font-size:12px;line-height:1.7;margin:0 0 16px;">
                  Need to reply? Use the website contact portal. Direct email replies are not monitored.
                </p>
                <a href="${APP_URL}/#contact"
                   style="display:inline-block;background:#39FF14;color:#053900;padding:14px 28px;text-decoration:none;font-weight:700;letter-spacing:2px;text-transform:uppercase;">
                  REPLY_ON_WEBSITE →
                </a>
              </div>
            </div>
          </body>
        `,
    });

    await prisma.$transaction([
        prisma.contactReply.create({
            data: {
                contactMessageId: contact.id,
                subject: subject.trim(),
                body: body.trim(),
                sentByEmail: user.email,
                sentByName: [user.firstName, user.lastName].filter(Boolean).join(" ") || null,
            },
        }),
        prisma.contactMessage.update({
            where: { id: contact.id },
            data: {
                status: "RESPONDED",
                respondedAt: new Date(),
                responseCount: { increment: 1 },
            },
        }),
    ]);

    return NextResponse.json({ ok: true });
}
