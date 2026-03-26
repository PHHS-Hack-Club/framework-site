import { NextRequest, NextResponse } from "next/server";
import { randomUUID } from "crypto";
import { getCurrentUser } from "@/app/lib/auth";
import { uploadFile } from "@/app/lib/storage";

const MAX_SIZE = 8 * 1024 * 1024; // 8 MB
const ALLOWED_TYPES: Record<string, string> = {
    "image/jpeg": "jpg",
    "image/png": "png",
    "image/webp": "webp",
    "image/heic": "heic",
    "image/heif": "heif",
};

export async function POST(req: NextRequest) {
    const user = await getCurrentUser();
    if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const formData = await req.formData();
    const file = formData.get("file") as File | null;

    if (!file) return NextResponse.json({ error: "No file provided" }, { status: 400 });
    if (!ALLOWED_TYPES[file.type]) {
        return NextResponse.json({ error: "File must be a JPEG, PNG, WebP, or HEIC image" }, { status: 400 });
    }
    if (file.size > MAX_SIZE) {
        return NextResponse.json({ error: "File must be under 8 MB" }, { status: 400 });
    }

    const ext = ALLOWED_TYPES[file.type];
    const filename = `${user.id}_${randomUUID()}.${ext}`;
    const bytes = Buffer.from(await file.arrayBuffer());

    await uploadFile(`school-ids/${filename}`, bytes, file.type);

    return NextResponse.json({ filename });
}
