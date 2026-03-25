"use client";

import { useEffect, useState, useRef } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import dynamic from "next/dynamic";
import Link from "next/link";

const HeroScene = dynamic(() => import("./HeroScene"), { ssr: false });

// ─── Glitchy Typewriter ───────────────────────────────────────────────────────
const GLITCH_CHARS = "!<>-_\\/[]{}—=+*^?#@$%&";

function GlitchTyper({
    text,
    delay = 0,
    speed = 28,
}: {
    text: string;
    delay?: number;
    speed?: number;
}) {
    const [displayed, setDisplayed] = useState("");
    const [done, setDone] = useState(false);
    const frame = useRef(0);

    useEffect(() => {
        const t = setTimeout(() => {
            let i = 0;
            const run = () => {
                frame.current = window.setTimeout(() => {
                    if (i <= text.length) {
                        const correct = text.slice(0, i);
                        const glitch =
                            i < text.length
                                ? GLITCH_CHARS[Math.floor(Math.random() * GLITCH_CHARS.length)]
                                : "";
                        setDisplayed(correct + glitch);
                        i++;
                        if (i > text.length) {
                            setDisplayed(text);
                            setDone(true);
                            return;
                        }
                        run();
                    }
                }, speed + Math.random() * 20 - 10);
            };
            run();
        }, delay);
        return () => {
            clearTimeout(t);
            clearTimeout(frame.current);
        };
    }, [text, delay, speed]);

    return (
        <span>
            {displayed}
            {!done && <span className="opacity-50">▮</span>}
        </span>
    );
}

// ─── Slot counter ─────────────────────────────────────────────────────────────
function SlotNumber({ to, delay = 0 }: { to: number; delay?: number }) {
    const [val, setVal] = useState(0);
    useEffect(() => {
        const t = setTimeout(() => {
            let cur = 0;
            const step = () => {
                cur += Math.ceil((to - cur) / 6);
                setVal(Math.min(cur, to));
                if (cur < to) setTimeout(step, 40);
            };
            step();
        }, delay);
        return () => clearTimeout(t);
    }, [to, delay]);
    return <span>{val}</span>;
}

const TICKER =
    " ⬡ FRAMEWORK 2027 ⬡ PHHS HACK CLUB ⬡ 64 SLOTS ⬡ BERGEN COUNTY ⬡ PRIZES $5,000+ ⬡ 24 HOURS ⬡ BUILDING BEGINS >";

export default function HeroSection() {
    const { scrollY } = useScroll();
    const sceneOpacity = useTransform(scrollY, [0, 500], [1, 0]);
    const textY = useTransform(scrollY, [0, 400], [0, -60]);

    return (
        <section
            id="hero"
            className="relative min-h-screen flex flex-col justify-center overflow-hidden grid-bg"
        >
            {/* ── Fine dot grid ── */}
            <div className="absolute inset-0 z-0 pointer-events-none opacity-40 grid-bg" />

            {/* ── Gradient overlays ── */}
            <div className="absolute inset-0 z-[1] pointer-events-none">
                {/* Left fade — ensures text is always readable */}
                <div className="absolute inset-0 bg-gradient-to-r from-[#131313] via-[#131313]/60 to-transparent" />
                {/* Top + bottom fades */}
                <div className="absolute inset-0 bg-gradient-to-t from-[#131313] via-transparent to-transparent" />
            </div>

            {/* ── 3D Scene — right column, 50% width ── */}
            <motion.div
                style={{ opacity: sceneOpacity }}
                className="absolute right-0 top-0 w-[52%] h-full pointer-events-none z-0"
            >
                <HeroScene />
            </motion.div>

            {/* ── Text — left column ── */}
            <motion.div
                style={{ y: textY }}
                className="relative z-10 px-8 md:px-20 pt-32 pb-28 max-w-[54rem]"
            >
                {/* Status chip */}
                <motion.div
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.2, duration: 0.5 }}
                    className="flex items-center gap-4 mb-8"
                >
                    <div className="flex items-center gap-2 bg-[#39FF14]/10 border border-[#39FF14]/30 px-4 py-2">
                        <span className="w-2 h-2 rounded-full bg-[#39FF14] animate-pulse" />
                        <span className="font-mono text-[#39FF14] text-xs tracking-[0.3em] uppercase">
                            SYSTEM_ONLINE
                        </span>
                    </div>
                    <span className="font-mono text-on-surface-variant text-xs tracking-widest hidden md:block">
                        BUILD_4.2.0-STABLE
                    </span>
                </motion.div>

                {/* Main title */}
                <motion.h1
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.35, duration: 0.6 }}
                    id="hero-title"
                    className="font-headline font-black uppercase italic leading-[0.88] mb-6"
                >
                    <span className="block text-[clamp(3.5rem,10vw,8rem)] text-on-surface">
                        FRAME
                    </span>
                    <span className="block text-[clamp(3.5rem,10vw,8rem)] text-on-surface">
                        WORK
                    </span>
                    <motion.span
                        animate={{
                            textShadow: [
                                "0 0 8px #39FF14, 0 0 20px rgba(57,255,20,0.4)",
                                "0 0 24px #39FF14, 0 0 60px rgba(57,255,20,0.8), 0 0 100px rgba(57,255,20,0.3)",
                                "0 0 8px #39FF14, 0 0 20px rgba(57,255,20,0.4)",
                            ],
                        }}
                        transition={{ duration: 2.5, repeat: Infinity, ease: "easeInOut" }}
                        className="block text-[clamp(4.5rem,13vw,11rem)] text-[#39FF14] leading-[0.88]"
                    >
                        2027
                    </motion.span>
                </motion.h1>

                {/* Divider */}
                <motion.div
                    initial={{ scaleX: 0 }}
                    animate={{ scaleX: 1 }}
                    transition={{ delay: 0.6, duration: 0.8, ease: "easeOut" }}
                    style={{ originX: 0 }}
                    className="h-[2px] w-48 bg-gradient-to-r from-[#39FF14] to-transparent mb-8"
                />

                {/* Tagline */}
                <p className="font-mono text-on-surface-variant text-xs tracking-[0.25em] uppercase mb-3">
                    PHHS HACK CLUB // BERGEN COUNTY, NJ
                </p>
                <div className="font-mono text-[#39FF14]/80 text-sm md:text-base max-w-md mb-10 min-h-[1.5rem]">
                    <GlitchTyper
                        text="AN ELITE GATHERING OF BUILDERS, BREAKERS, AND VISIONARIES."
                        delay={1000}
                        speed={22}
                    />
                </div>

                {/* Stats */}
                <motion.div
                    initial={{ opacity: 0, y: 16 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.9 }}
                    className="flex gap-8 mb-10"
                >
                    {[
                        { label: "SLOTS", val: 64, suffix: "" },
                        { label: "HOURS", val: 24, suffix: "" },
                        { label: "PRIZE_$", val: 5000, suffix: "+" },
                    ].map((s) => (
                        <div key={s.label} className="border-l-2 border-[#39FF14]/40 pl-4">
                            <div className="font-mono font-bold text-xl md:text-2xl text-on-surface">
                                <SlotNumber to={s.val} delay={1200} />
                                {s.suffix}
                            </div>
                            <div className="font-mono text-[9px] text-on-surface-variant tracking-[0.3em] mt-0.5">
                                {s.label}
                            </div>
                        </div>
                    ))}
                </motion.div>

                {/* CTAs */}
                <motion.div
                    initial={{ opacity: 0, y: 16 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 1.1 }}
                    className="flex flex-wrap gap-4"
                >
                    <Link href="/auth/signup">
                        <motion.div
                            whileHover={{ scale: 1.04, boxShadow: "0 0 40px rgba(57,255,20,0.5)" }}
                            whileTap={{ scale: 0.97 }}
                            className="bg-[#39FF14] text-[#053900] px-8 py-4 font-mono font-bold text-xs tracking-[0.2em] uppercase cursor-pointer flex items-center gap-3 group"
                        >
                            APPLY_NOW
                            <span className="group-hover:translate-x-1 transition-transform">→</span>
                        </motion.div>
                    </Link>
                    <motion.a
                        href="#about"
                        whileHover={{ borderColor: "rgba(57,255,20,0.6)", backgroundColor: "rgba(57,255,20,0.04)" }}
                        className="border border-[#39FF14]/25 text-[#39FF14] px-8 py-4 font-mono text-xs tracking-[0.2em] uppercase transition-colors"
                    >
                        LEARN_MORE
                    </motion.a>
                </motion.div>
            </motion.div>

            {/* ── Ticker ── */}
            <div className="absolute bottom-0 left-0 w-full bg-[#0a0a0a]/80 border-t border-[#39FF14]/10 py-2 overflow-hidden whitespace-nowrap z-20 backdrop-blur-sm">
                <div className="animate-marquee font-mono text-[9px] text-[#39FF14]/60 tracking-[0.25em] uppercase">
                    {(TICKER + "  ").repeat(5)}
                </div>
            </div>

            {/* Scanline */}
            <div className="absolute inset-0 scanline-overlay z-[2] pointer-events-none" />
        </section>
    );
}
