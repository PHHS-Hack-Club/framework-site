import { BUILD_ID } from "@/app/lib/build";

export default function BuildStamp() {
    return (
        <div className="pointer-events-none fixed bottom-4 right-4 z-[110] border border-[#39FF14]/20 bg-black/70 px-3 py-2 font-mono text-[10px] uppercase tracking-[0.22em] text-[#39FF14]/80 backdrop-blur-sm">
            BUILD // {BUILD_ID}
        </div>
    );
}
