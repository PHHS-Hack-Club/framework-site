import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/app/lib/prisma";
import {
    hashPassword,
    generateVerificationToken,
    sendVerificationEmail,
} from "@/app/lib/auth";
import { isAdminEmail, normalizeEmail } from "@/app/lib/site";

export async function POST(req: NextRequest) {
    try {
        const { email, password, firstName, lastName } = await req.json();
        const normalizedEmail = typeof email === "string" ? normalizeEmail(email) : "";

        if (!normalizedEmail || !password) {
            return NextResponse.json(
                { error: "Email and password are required." },
                { status: 400 }
            );
        }

        if (password.length < 8) {
            return NextResponse.json(
                { error: "Password must be at least 8 characters." },
                { status: 400 }
            );
        }

        const existing = await prisma.user.findUnique({ where: { email: normalizedEmail } });
        if (existing) {
            return NextResponse.json(
                { error: "An account with this email already exists." },
                { status: 409 }
            );
        }

        const passwordHash = await hashPassword(password);
        const verificationToken = generateVerificationToken();
        const tokenExpiresAt = new Date(Date.now() + 24 * 60 * 60 * 1000);

        await prisma.user.create({
            data: {
                email: normalizedEmail,
                passwordHash,
                firstName,
                lastName,
                verificationToken,
                tokenExpiresAt,
                role: isAdminEmail(normalizedEmail) ? "ORGANIZER" : "HACKER",
            },
        });

        await sendVerificationEmail(normalizedEmail, verificationToken);

        return NextResponse.json({ ok: true });
    } catch (err) {
        console.error("[signup]", err);
        return NextResponse.json({ error: "Internal server error." }, { status: 500 });
    }
}
