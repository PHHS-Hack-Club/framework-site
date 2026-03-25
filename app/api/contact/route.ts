import { NextRequest, NextResponse } from "next/server";
import { sendEmail } from "@/app/lib/mail";

const CONTACT_TO = process.env.CONTACT_EMAIL_TO ?? "alexradu@phhshack.club";
const CONTACT_CC = "al3x.radu1@gmail.com";

function escapeHtml(value: string) {
    return value
        .replaceAll("&", "&amp;")
        .replaceAll("<", "&lt;")
        .replaceAll(">", "&gt;")
        .replaceAll('"', "&quot;")
        .replaceAll("'", "&#39;");
}

export async function POST(req: NextRequest) {
    const body = await req.json().catch(() => null);
    const name = body?.name?.trim();
    const email = body?.email?.trim();
    const subject = body?.subject?.trim();
    const message = body?.message?.trim();

    if (!name || !email || !subject || !message) {
        return NextResponse.json({ error: "All fields are required." }, { status: 400 });
    }

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
        return NextResponse.json({ error: "Enter a valid email address." }, { status: 400 });
    }

    if (name.length > 120 || email.length > 200 || subject.length > 160 || message.length > 5000) {
        return NextResponse.json({ error: "Message is too large." }, { status: 400 });
    }

    await sendEmail({
        to: CONTACT_TO,
        cc: CONTACT_CC,
        replyTo: email,
        subject: `[Framework Contact] ${subject}`,
        html: `
          <body style="background:#131313;color:#e5e2e1;font-family:'JetBrains Mono',monospace;padding:40px;">
            <div style="max-width:620px;margin:0 auto;border-left:4px solid #39FF14;padding-left:24px;">
              <h1 style="color:#39FF14;font-size:14px;letter-spacing:4px;text-transform:uppercase;margin-bottom:8px;">
                FRAMEWORK_2027
              </h1>
              <h2 style="font-size:24px;margin-bottom:16px;">New contact form message</h2>
              <p style="color:#baccb0;margin:0 0 10px;">
                <strong>Name:</strong> ${escapeHtml(name)}
              </p>
              <p style="color:#baccb0;margin:0 0 10px;">
                <strong>Email:</strong> ${escapeHtml(email)}
              </p>
              <p style="color:#baccb0;margin:0 0 24px;">
                <strong>Subject:</strong> ${escapeHtml(subject)}
              </p>
              <div style="background:#0e0e0e;border:1px solid #3c4b35;padding:18px;white-space:pre-wrap;line-height:1.7;color:#e5e2e1;">
                ${escapeHtml(message)}
              </div>
            </div>
          </body>
        `,
    });

    return NextResponse.json({ ok: true });
}
