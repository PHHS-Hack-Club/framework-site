import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/app/lib/prisma";
import { getCurrentUser } from "@/app/lib/auth";

// Duplicate the getEmails logic here to avoid cross-route imports
async function getEmails(audience: string): Promise<string[]> {
    if (audience === "ALL") {
        const users = await prisma.user.findMany({ where: { role: "HACKER", emailVerified: true } });
        return users.map(u => u.email);
    }
    const apps = await prisma.application.findMany({ where: { status: audience as never }, include: { user: true } });
    return apps.map(a => a.user.email);
}

export async function GET(req: NextRequest) {
    const user = await getCurrentUser();
    if (!user || user.role !== "ORGANIZER") return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    const audience = req.nextUrl.searchParams.get("audience") ?? "ALL";
    const emails = await getEmails(audience);
    return NextResponse.json({ emails });
}
