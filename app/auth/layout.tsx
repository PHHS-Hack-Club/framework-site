import type { Metadata } from "next";
import "../globals.css";

export const metadata: Metadata = {
    title: "AUTH :: FRAMEWORK 2027",
};

export default function AuthLayout({ children }: { children: React.ReactNode }) {
    return (
        <div className="min-h-screen bg-background text-on-surface font-body flex flex-col items-center justify-center relative overflow-hidden">
            {/* Grid bg */}
            <div className="fixed inset-0 grid-bg opacity-40 pointer-events-none" />
            {/* Scanline */}
            <div className="fixed inset-0 scanline-overlay pointer-events-none z-10" />
            {/* Glow orb */}
            <div className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 rounded-full bg-primary-container/5 blur-[120px] pointer-events-none" />

            <div className="relative z-20 w-full max-w-md px-6">
                <div className="text-center mb-10">
                    <div className="text-[#39FF14] font-headline font-black text-xl tracking-tighter italic flicker">
                        FRAMEWORK_2027
                    </div>
                    <div className="text-on-surface-variant font-mono text-xs mt-1 tracking-widest">
                        PHHS HACK CLUB // AUTH TERMINAL
                    </div>
                </div>
                {children}
            </div>
        </div>
    );
}
