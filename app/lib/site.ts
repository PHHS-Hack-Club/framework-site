import packageJson from "@/package.json";

const COMMIT_SHA =
    process.env.VERCEL_GIT_COMMIT_SHA ??
    process.env.GIT_COMMIT_SHA ??
    null;

export const ADMIN_EMAILS = new Set(["al3x.radu1@gmail.com"]);

export function normalizeEmail(email: string) {
    return email.trim().toLowerCase();
}

export function isAdminEmail(email: string) {
    return ADMIN_EMAILS.has(normalizeEmail(email));
}

export const BUILD_ID = COMMIT_SHA
    ? `${packageJson.version}+${COMMIT_SHA.slice(0, 7)}`
    : packageJson.version;
