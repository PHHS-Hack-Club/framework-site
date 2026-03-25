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
    " ⬡ FRAMEWORK 2027 ⬡ PHHS HACK CLUB ⬡ BERGEN COUNTY ⬡ PRIZES $5,000+ ⬡ SAME-DAY BUILD ⬡ SOFTWARE ONLY ⬡ PRIOR CODING REQUIRED ⬡ THEME_REVEALED_DAY_OF >";

const SIGNAL_TAGS = [
    "same-day build sprint",
    "software only",
    "prior coding required",
    "theme drops day-of",
];

export default function HeroSection() {
    const { scrollY } = useScroll();
    const sceneOpacity = useTransform(scrollY, [0, 500], [1, 0]);
    const textY = useTransform(scrollY, [0, 400], [0, -60]);
    const gridY = useTransform(scrollY, [0, 600], [0, 80]);
    const glowX = useTransform(scrollY, [0, 700], [0, 120]);

    return (
        <section
            id="hero"
            className="relative h-screen overflow-hidden grid-bg"
        >
            <motion.div
                style={{ y: gridY }}
                className="absolute inset-0 z-0 pointer-events-none opacity-40 grid-bg"
            />

            <div className="absolute inset-0 z-[1] pointer-events-none">
                <div className="absolute inset-0 bg-gradient-to-r from-[#131313] via-[#131313]/60 to-transparent" />
                <div className="absolute inset-0 bg-gradient-to-t from-[#131313] via-transparent to-transparent" />
            </div>
            <motion.div
                style={{ x: glowX }}
                animate={{ opacity: [0.2, 0.45, 0.2], scale: [0.96, 1.08, 0.96] }}
                transition={{ duration: 9, repeat: Infinity, ease: "easeInOut" }}
                className="pointer-events-none absolute -right-24 top-1/2 z-[1] h-[26rem] w-[26rem] -translate-y-1/2 rounded-full bg-[radial-gradient(circle,rgba(57,255,20,0.18),transparent_62%)] blur-3xl"
            />
            <motion.div
                animate={{ opacity: [0.12, 0.22, 0.12], y: [0, -18, 0] }}
                transition={{ duration: 7.5, repeat: Infinity, ease: "easeInOut" }}
                className="pointer-events-none absolute -left-20 bottom-12 z-[1] h-56 w-56 rounded-full bg-[radial-gradient(circle,rgba(57,255,20,0.12),transparent_70%)] blur-3xl"
            />

            <div className="relative z-10 grid h-full grid-cols-1 items-center px-6 pb-12 pt-20 md:grid-cols-[minmax(0,0.92fr)_minmax(360px,0.98fr)] md:gap-2 md:px-14 md:pb-14 md:pt-20 lg:px-20 lg:pb-16">
                <motion.div
                    style={{ y: textY }}
                    className="max-w-[38rem] md:max-w-[40rem] md:pr-6"
                >
                    <motion.div
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.2, duration: 0.5 }}
                        className="mb-4 flex items-center gap-3 md:mb-5 md:gap-4"
                    >
                        <div className="flex items-center gap-2 border border-[#39FF14]/30 bg-[#39FF14]/10 px-3 py-2 md:px-4">
                            <span className="h-2 w-2 rounded-full bg-[#39FF14] animate-pulse" />
                            <span className="font-mono text-xs tracking-[0.3em] text-[#39FF14] uppercase">
                                SYSTEM_ONLINE
                            </span>
                        </div>
                        <span className="hidden font-mono text-xs tracking-widest text-on-surface-variant md:block">
                            SAME_DAY_BUILD_ONLY
                        </span>
                    </motion.div>

                    <motion.h1
                        initial={{ opacity: 0, y: 30 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.35, duration: 0.6 }}
                        id="hero-title"
                        className="mb-2 font-headline font-black uppercase italic leading-[0.86] md:mb-3"
                    >
                        <span className="block text-[clamp(2.4rem,6.5vw,5.5rem)] text-on-surface">
                            FRAME
                        </span>
                        <span className="block text-[clamp(2.4rem,6.5vw,5.5rem)] text-on-surface">
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
                            className="block text-[clamp(3rem,8.5vw,7rem)] leading-[0.88] text-[#39FF14]"
                        >
                            2027
                        </motion.span>
                    </motion.h1>

                    <motion.div
                        initial={{ scaleX: 0 }}
                        animate={{ scaleX: 1 }}
                        transition={{ delay: 0.6, duration: 0.8, ease: "easeOut" }}
                        style={{ originX: 0 }}
                        className="mb-3 h-[2px] w-32 bg-gradient-to-r from-[#39FF14] to-transparent md:mb-4 md:w-40"
                    />

                    <p className="mb-2 font-mono text-[11px] uppercase tracking-[0.22em] text-on-surface-variant md:mb-3">
                        PHHS HACK CLUB // BERGEN COUNTY, NJ
                    </p>
                    <div className="mb-4 min-h-[1.5rem] max-w-sm font-mono text-sm text-[#39FF14]/80 md:mb-5 md:max-w-md md:text-[15px]">
                        <GlitchTyper
                            text="SOFTWARE HACKATHON. SAME DAY. ARRIVE READY TO SHIP."
                            delay={1000}
                            speed={22}
                        />
                    </div>
                    <motion.p
                        initial={{ opacity: 0, y: 14 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.88, duration: 0.55 }}
                        className="mb-5 max-w-xl text-sm leading-7 text-on-surface-variant md:mb-6 md:text-[15px]"
                    >
                        This is not an overnight and not a learnathon. Bring a laptop with your stack
                        running locally, expect a software-only build sprint, and expect the theme to
                        land day-of when organizers open the real project flow.
                    </motion.p>
                    <motion.div
                        initial={{ opacity: 0, y: 16 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 1 }}
                        className="mb-5 flex flex-wrap gap-2 md:mb-6"
                    >
                        {SIGNAL_TAGS.map((tag, index) => (
                            <motion.span
                                key={tag}
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: 1.02 + index * 0.08 }}
                                whileHover={{ y: -2, borderColor: "rgba(57,255,20,0.5)" }}
                                className="border border-[#39FF14]/20 bg-black/20 px-3 py-2 font-mono text-[10px] uppercase tracking-[0.2em] text-on-surface-variant"
                            >
                                {tag}
                            </motion.span>
                        ))}
                    </motion.div>

                    <motion.div
                        initial={{ opacity: 0, y: 16 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.9 }}
                        className="mb-5 flex flex-wrap gap-x-6 gap-y-3 md:mb-6 md:gap-x-8"
                    >
                        {[
                            { label: "THEME", display: "DAY_OF" },
                            { label: "MAX_TEAM", val: 4, suffix: "" },
                            { label: "PRIZE_$", val: 5000, suffix: "+" },
                        ].map((s, index) => (
                            <motion.div
                                key={s.label}
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: 1.08 + index * 0.08 }}
                                whileHover={{ y: -4 }}
                                className="border-l-2 border-[#39FF14]/40 pl-3 md:pl-4"
                            >
                                <div className="font-mono text-lg font-bold text-on-surface md:text-2xl">
                                    {"display" in s ? (
                                        <span>{s.display}</span>
                                    ) : (
                                        <>
                                            <SlotNumber to={s.val} delay={1200} />
                                            {s.suffix}
                                        </>
                                    )}
                                </div>
                                <div className="mt-0.5 font-mono text-[9px] tracking-[0.3em] text-on-surface-variant">
                                    {s.label}
                                </div>
                            </motion.div>
                        ))}
                    </motion.div>

                    <motion.div
                        initial={{ opacity: 0, y: 16 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 1.1 }}
                        className="flex flex-wrap gap-3 md:gap-4"
                    >
                        <Link href="/auth/signup">
                            <motion.div
                                whileHover={{
                                    scale: 1.04,
                                    y: -3,
                                    boxShadow: "0 0 40px rgba(57,255,20,0.5)",
                                }}
                                whileTap={{ scale: 0.97 }}
                                className="group flex cursor-pointer items-center gap-3 bg-[#39FF14] px-6 py-3 font-mono text-xs font-bold tracking-[0.2em] text-[#053900] uppercase md:px-8 md:py-4"
                            >
                                APPLY_NOW
                                <span className="transition-transform group-hover:translate-x-1">→</span>
                            </motion.div>
                        </Link>
                        <motion.a
                            href="#about"
                            whileHover={{
                                y: -3,
                                borderColor: "rgba(57,255,20,0.6)",
                                backgroundColor: "rgba(57,255,20,0.04)",
                            }}
                            className="border border-[#39FF14]/25 px-6 py-3 font-mono text-xs tracking-[0.2em] text-[#39FF14] uppercase transition-colors md:px-8 md:py-4"
                        >
                            VIEW_BRIEF
                        </motion.a>
                    </motion.div>
                </motion.div>

                <motion.div
                    style={{ opacity: sceneOpacity }}
                    className="relative hidden h-full w-full md:block"
                >
                    {/* Soft atmospheric glow behind the orb */}
                    <div className="absolute inset-0 bg-[radial-gradient(ellipse_60%_55%_at_50%_50%,rgba(57,255,20,0.07),transparent_70%)]" />
                    <div className="h-full w-full">
                        <HeroScene />
                    </div>
                </motion.div>
            </div>

            <div className="absolute bottom-0 left-0 z-20 w-full overflow-hidden whitespace-nowrap border-t border-[#39FF14]/10 bg-[#0a0a0a]/80 py-2 backdrop-blur-sm">
                <div className="animate-marquee font-mono text-[9px] text-[#39FF14]/60 tracking-[0.25em] uppercase">
                    {(TICKER + "  ").repeat(5)}
                </div>
            </div>

            <div className="absolute inset-0 scanline-overlay z-[2] pointer-events-none" />
        </section>
    );
}
