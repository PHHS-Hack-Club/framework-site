import packageJson from "@/package.json";

const COMMIT_SHA =
    process.env.VERCEL_GIT_COMMIT_SHA ??
    process.env.GIT_COMMIT_SHA ??
    null;

export const BUILD_ID = COMMIT_SHA
    ? `${packageJson.version}+${COMMIT_SHA.slice(0, 7)}`
    : packageJson.version;
