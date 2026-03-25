import { NextRequest, NextResponse } from "next/server";
import { clearSessionCookie, SESSION_COOKIE, deleteSession } from "@/app/lib/auth";
import { cookies } from "next/headers";

export async function POST(req: NextRequest) {
    const jar = await cookies();
    const token = jar.get(SESSION_COOKIE)?.value;
    if (token) await deleteSession(token);
    await clearSessionCookie();
    return NextResponse.json({ ok: true });
}
