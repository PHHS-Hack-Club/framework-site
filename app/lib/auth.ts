import { SignJWT, jwtVerify } from "jose";
import { cookies } from "next/headers";
import { prisma } from "./prisma";
import bcrypt from "bcryptjs";
import type { User } from "@prisma/client";
import { sendEmail } from "./mail";
import { isAdminEmail } from "./site";

const JWT_SECRET = new TextEncoder().encode(
    process.env.JWT_SECRET ?? "dev-secret-change-in-production"
);
const SESSION_DURATION_DAYS = 30;

// ─── Password ──────────────────────────────────────────────────────────────

export async function hashPassword(password: string) {
    return bcrypt.hash(password, 12);
}

export async function verifyPassword(password: string, hash: string) {
    return bcrypt.compare(password, hash);
}

// ─── JWT Sessions ──────────────────────────────────────────────────────────

export async function createSession(userId: string): Promise<string> {
    const expiresAt = new Date(
        Date.now() + SESSION_DURATION_DAYS * 24 * 60 * 60 * 1000
    );

    const token = await new SignJWT({ userId })
        .setProtectedHeader({ alg: "HS256" })
        .setExpirationTime(`${SESSION_DURATION_DAYS}d`)
        .setIssuedAt()
        .sign(JWT_SECRET);

    await prisma.session.create({ data: { userId, token, expiresAt } });
    return token;
}

export async function getSessionUser(
    token: string
): Promise<User | null> {
    try {
        await jwtVerify(token, JWT_SECRET);
    } catch {
        return null;
    }
    const session = await prisma.session.findUnique({
        where: { token },
        include: { user: true },
    });
    if (!session || session.expiresAt < new Date()) return null;
    if (isAdminEmail(session.user.email) && session.user.role !== "ORGANIZER") {
        return prisma.user.update({
            where: { id: session.user.id },
            data: { role: "ORGANIZER" },
        });
    }
    return session.user;
}

export async function deleteSession(token: string) {
    await prisma.session.deleteMany({ where: { token } });
}

// ─── Cookie helpers ────────────────────────────────────────────────────────

export const SESSION_COOKIE = "fw27_session";

export async function setSessionCookie(token: string) {
    const jar = await cookies();
    jar.set(SESSION_COOKIE, token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "lax",
        maxAge: SESSION_DURATION_DAYS * 24 * 60 * 60,
        path: "/",
    });
}

export async function clearSessionCookie() {
    const jar = await cookies();
    jar.delete(SESSION_COOKIE);
}

export async function getCurrentUser(): Promise<User | null> {
    const jar = await cookies();
    const token = jar.get(SESSION_COOKIE)?.value;
    if (!token) return null;
    return getSessionUser(token);
}

// ─── Email Verification ────────────────────────────────────────────────────

export function generateVerificationToken(): string {
    return crypto.randomUUID() + crypto.randomUUID();
}

export async function sendVerificationEmail(
    email: string,
    token: string
): Promise<void> {
    const url = `${process.env.APP_URL}/api/auth/verify?token=${token}`;

    await sendEmail({
        to: email,
        subject: "VERIFY_EMAIL :: FRAMEWORK 2027",
        html: `
      <!DOCTYPE html>
      <html>
        <body style="background:#131313;color:#e5e2e1;font-family:'JetBrains Mono',monospace;padding:40px;">
          <div style="max-width:480px;margin:0 auto;border-left:4px solid #39FF14;padding-left:24px;">
            <h1 style="color:#39FF14;font-size:14px;letter-spacing:4px;text-transform:uppercase;margin-bottom:8px;">
              FRAMEWORK_2027
            </h1>
            <h2 style="font-size:24px;margin-bottom:16px;">Verify your email</h2>
            <p style="color:#baccb0;margin-bottom:32px;">
              Click the link below to verify your email address and activate your account.
              This link expires in <strong style="color:#39FF14;">24 hours</strong>.
            </p>
            <a href="${url}"
               style="display:inline-block;background:#39FF14;color:#053900;padding:14px 28px;
                      text-decoration:none;font-weight:700;letter-spacing:2px;text-transform:uppercase;">
              VERIFY_EMAIL →
            </a>
            <p style="color:#3c4b35;font-size:11px;margin-top:32px;">
              If you didn't create an account, ignore this email.
            </p>
          </div>
        </body>
      </html>
    `,
    });
}

export async function sendPasswordResetEmail(
    email: string,
    token: string
): Promise<void> {
    const url = `${process.env.APP_URL}/auth/reset-password?token=${token}`;
    await sendEmail({
        to: email,
        subject: "PASSWORD_RESET :: FRAMEWORK 2027",
        html: `
      <!DOCTYPE html>
      <html>
        <body style="background:#131313;color:#e5e2e1;font-family:'JetBrains Mono',monospace;padding:40px;">
          <div style="max-width:480px;margin:0 auto;border-left:4px solid #39FF14;padding-left:24px;">
            <h1 style="color:#39FF14;font-size:14px;letter-spacing:4px;">FRAMEWORK_2027</h1>
            <h2>Reset your password</h2>
            <p style="color:#baccb0;">This link expires in 1 hour.</p>
            <a href="${url}" style="display:inline-block;background:#39FF14;color:#053900;padding:14px 28px;text-decoration:none;font-weight:700;text-transform:uppercase;">
              RESET_PASSWORD →
            </a>
          </div>
        </body>
      </html>
    `,
    });
}
