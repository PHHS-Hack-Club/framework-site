import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/app/lib/prisma";
import {
    hashPassword,
    generateVerificationToken,
    sendVerificationEmail,
} from "@/app/lib/auth";

export async function POST(req: NextRequest) {
    try {
        const { email, password, firstName, lastName } = await req.json();

        if (!email || !password) {
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

        const existing = await prisma.user.findUnique({ where: { email } });
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
                email,
                passwordHash,
                firstName,
                lastName,
                verificationToken,
                tokenExpiresAt,
                role: "HACKER",
            },
        });

        await sendVerificationEmail(email, verificationToken);

        return NextResponse.json({ ok: true });
    } catch (err) {
        console.error("[signup]", err);
        return NextResponse.json({ error: "Internal server error." }, { status: 500 });
    }
}
