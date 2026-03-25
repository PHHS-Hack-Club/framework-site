import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/app/lib/prisma";
import { getCurrentUser } from "@/app/lib/auth";

export async function GET(req: NextRequest) {
    const user = await getCurrentUser();
    if (!user || user.role !== "ORGANIZER") return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    const q = req.nextUrl.searchParams.get("q") ?? "";
    const users = await prisma.user.findMany({
        where: {
            role: "HACKER",
            OR: [
                { email: { contains: q, mode: "insensitive" } },
                { firstName: { contains: q, mode: "insensitive" } },
                { lastName: { contains: q, mode: "insensitive" } },
            ],
        },
        include: { application: true },
        take: 20,
    });
    return NextResponse.json(users);
}
