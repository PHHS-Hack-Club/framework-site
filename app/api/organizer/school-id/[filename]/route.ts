import { NextRequest, NextResponse } from "next/server";
import { getCurrentUser } from "@/app/lib/auth";
import { getPresignedUrl } from "@/app/lib/storage";

export async function GET(
    _req: NextRequest,
    { params }: { params: Promise<{ filename: string }> }
) {
    const user = await getCurrentUser();
    if (!user || user.role !== "ORGANIZER") {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { filename } = await params;
    // Prevent path traversal — key must start with school-ids/
    const key = `school-ids/${filename}`;
    if (key.includes("..")) {
        return NextResponse.json({ error: "Invalid path" }, { status: 400 });
    }

    const url = await getPresignedUrl(key, 300); // 5-minute presigned URL
    return NextResponse.redirect(url);
}
