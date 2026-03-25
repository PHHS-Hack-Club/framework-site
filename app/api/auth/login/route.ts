import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/app/lib/prisma";
import {
    verifyPassword,
    createSession,
    setSessionCookie,
} from "@/app/lib/auth";
import { isAdminEmail, normalizeEmail } from "@/app/lib/site";

export async function POST(req: NextRequest) {
    try {
        const { email, password } = await req.json();
        const normalizedEmail = typeof email === "string" ? normalizeEmail(email) : "";

        let user = await prisma.user.findUnique({ where: { email: normalizedEmail } });
        if (!user) {
            return NextResponse.json(
                { error: "Invalid email or password." },
                { status: 401 }
            );
        }

        const valid = await verifyPassword(password, user.passwordHash);
        if (!valid) {
            return NextResponse.json(
                { error: "Invalid email or password." },
                { status: 401 }
            );
        }

        if (!user.emailVerified) {
            return NextResponse.json(
                { error: "Please verify your email before logging in." },
                { status: 403 }
            );
        }

        if (isAdminEmail(user.email) && user.role !== "ORGANIZER") {
            user = await prisma.user.update({
                where: { id: user.id },
                data: { role: "ORGANIZER" },
            });
        }

        const token = await createSession(user.id);
        await setSessionCookie(token);

        return NextResponse.json({
            ok: true,
            role: user.role,
            redirect:
                user.role === "ORGANIZER"
                    ? "/organizer"
                    : user.role === "JUDGE"
                        ? "/judge"
                        : "/hacker",
        });
    } catch (err) {
        console.error("[login]", err);
        return NextResponse.json({ error: "Internal server error." }, { status: 500 });
    }
}
