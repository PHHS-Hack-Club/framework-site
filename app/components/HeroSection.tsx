"use client";

import { useEffect, useState, useRef, lazy, Suspense } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";

const HeroScene = lazy(() => import("./HeroScene"));

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
    " ⬡ FRAMEWORK 2027 ⬡ PHHS HACK CLUB ⬡ BERGEN COUNTY ⬡ PRIZE_POOL ??? ⬡ SAME-DAY BUILD ⬡ SOFTWARE ONLY ⬡ PRIOR CODING REQUIRED ⬡ THEME ??? >";

const SIGNAL_TAGS = [
    "same-day build sprint",
    "software only",
    "prior coding required",
];

let hasPlayedHeroBoot = false;

// ─── Boot sequence overlay ────────────────────────────────────────────────────
function BootSequence({ onComplete }: { onComplete: () => void }) {
    const [lines, setLines] = useState<string[]>([]);
    const bootLines = [
        "FRAMEWORK_OS v2.027 BOOT SEQUENCE",
        "LOADING KERNEL....... OK",
        "INITIALIZING DISPLAY...... OK",
        "CONNECTING TO NODE_NETWORK...... OK",
        "SCANNING BERGEN_COUNTY_NODES...... OK",
        "THEME_ENGINE: STANDBY",
        "SYSTEM_READY.",
    ];

    useEffect(() => {
        let i = 0;
        const interval = setInterval(() => {
            if (i < bootLines.length) {
                setLines((prev) => [...prev, bootLines[i]]);
                i++;
            } else {
                clearInterval(interval);
                setTimeout(onComplete, 300);
            }
        }, 120);
        return () => clearInterval(interval);
    }, []);

    return (
        <motion.div
            initial={{ opacity: 1 }}
            exit={{ opacity: 0, filter: "blur(8px)" }}
            transition={{ duration: 0.5 }}
            className="absolute inset-0 z-50 bg-[#0a0a0a] flex items-center justify-center"
        >
            <div className="font-mono text-[11px] text-[#39FF14]/80 space-y-1 max-w-md">
                {lines.map((line, i) => (
                    <motion.div
                        key={i}
                        initial={{ opacity: 0, x: -10 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.15 }}
                        className={i === lines.length - 1 ? "text-[#39FF14] font-bold mt-2" : ""}
                    >
                        <span className="text-[#39FF14]/40 mr-2">›</span>
                        {line}
                    </motion.div>
                ))}
                <motion.span
                    animate={{ opacity: [1, 0] }}
                    transition={{ duration: 0.5, repeat: Infinity }}
                    className="inline-block mt-1 text-[#39FF14]"
                >
                    ▮
                </motion.span>
            </div>
        </motion.div>
    );
}

export default function HeroSection({ dashboardHref }: { dashboardHref: string | null }) {
    const [booted, setBooted] = useState(hasPlayedHeroBoot);

    const completeBoot = () => {
        hasPlayedHeroBoot = true;
        setBooted(true);
    };

    return (
        <section
            id="hero"
            className="relative min-h-screen overflow-hidden grid-bg"
        >
            <AnimatePresence>
                {!booted && <BootSequence onComplete={completeBoot} />}
            </AnimatePresence>

            <div className="absolute inset-0 z-[1] pointer-events-none">
                <div className="absolute inset-0 bg-gradient-to-r from-[#131313] via-[#131313]/60 to-transparent" />
                <div className="absolute inset-0 bg-gradient-to-t from-[#131313] via-transparent to-transparent" />
            </div>
            <motion.div
                animate={{ scale: [1, 1.15, 1], opacity: [0.2, 0.4, 0.2] }}
                transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
                className="pointer-events-none absolute -right-24 top-1/2 z-[1] h-[26rem] w-[26rem] -translate-y-1/2 rounded-full bg-[radial-gradient(circle,rgba(57,255,20,0.18),transparent_62%)] blur-3xl"
            />
            <div className="pointer-events-none absolute -left-20 bottom-12 z-[1] h-56 w-56 rounded-full bg-[radial-gradient(circle,rgba(57,255,20,0.12),transparent_70%)] blur-3xl opacity-15" />

            <div className="relative z-10 grid h-full grid-cols-1 items-center px-6 pb-20 pt-18 md:grid-cols-[minmax(0,0.84fr)_minmax(320px,0.96fr)] md:gap-3 md:px-12 md:pb-22 md:pt-16 lg:px-16 lg:pb-24 lg:pt-16">
                <div className="max-w-[36rem] md:max-w-[37rem] md:pr-4">
                    <motion.div
                        initial={{ opacity: 0, x: -30, filter: "blur(8px)" }}
                        animate={booted ? { opacity: 1, x: 0, filter: "blur(0px)" } : {}}
                        transition={{ delay: 0.1, duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
                        className="mb-3 flex items-center gap-3 md:mb-4 md:gap-4"
                    >
                        <motion.div
                            initial={{ scale: 0.8, opacity: 0 }}
                            animate={booted ? { scale: 1, opacity: 1 } : {}}
                            transition={{ delay: 0.2, type: "spring", stiffness: 300 }}
                            className="flex items-center gap-2 border border-[#39FF14]/30 bg-[#39FF14]/10 px-3 py-2 md:px-4"
                        >
                            <span className="h-2 w-2 rounded-full bg-[#39FF14] animate-pulse" />
                            <span className="font-mono text-xs tracking-[0.3em] text-[#39FF14] uppercase">
                                SYSTEM_ONLINE
                            </span>
                        </motion.div>
                        <motion.span
                            initial={{ opacity: 0 }}
                            animate={booted ? { opacity: 1 } : {}}
                            transition={{ delay: 0.5 }}
                            className="hidden font-mono text-xs tracking-widest text-on-surface-variant uppercase md:block"
                        >
                            SAME_DAY_BUILD_ONLY
                        </motion.span>
                    </motion.div>

                    <motion.h1
                        initial={{ opacity: 0, y: 40, filter: "blur(12px)" }}
                        animate={booted ? { opacity: 1, y: 0, filter: "blur(0px)" } : {}}
                        transition={{ delay: 0.25, duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
                        id="hero-title"
                        className="mb-2 font-headline font-black uppercase italic leading-[0.9] md:mb-2"
                    >
                        <motion.span
                            initial={{ opacity: 0, x: -20 }}
                            animate={booted ? { opacity: 1, x: 0 } : {}}
                            transition={{ delay: 0.3, duration: 0.5 }}
                            className="block text-[clamp(2.2rem,5.8vw,5rem)] text-on-surface"
                        >
                            FRAME
                        </motion.span>
                        <motion.span
                            initial={{ opacity: 0, x: -20 }}
                            animate={booted ? { opacity: 1, x: 0 } : {}}
                            transition={{ delay: 0.4, duration: 0.5 }}
                            className="block text-[clamp(2.2rem,5.8vw,5rem)] text-on-surface"
                        >
                            WORK
                        </motion.span>
                        <motion.span
                            initial={{ opacity: 0, scale: 0.8, filter: "blur(16px)" }}
                            animate={booted ? {
                                opacity: 1,
                                scale: 1,
                                filter: "blur(0px)",
                                textShadow: [
                                    "0 0 8px #39FF14, 0 0 20px rgba(57,255,20,0.4)",
                                    "0 0 24px #39FF14, 0 0 60px rgba(57,255,20,0.8), 0 0 100px rgba(57,255,20,0.3)",
                                    "0 0 8px #39FF14, 0 0 20px rgba(57,255,20,0.4)",
                                ],
                            } : {}}
                            transition={{ delay: 0.5, duration: 0.8, textShadow: { duration: 2.5, repeat: Infinity, ease: "easeInOut" } }}
                            className="block text-[clamp(2.7rem,7.3vw,6.2rem)] leading-[0.88] text-[#39FF14]"
                        >
                            2027
                        </motion.span>
                    </motion.h1>

                    <motion.div
                        initial={{ scaleX: 0 }}
                        animate={booted ? { scaleX: 1 } : {}}
                        transition={{ delay: 0.6, duration: 1, ease: "easeOut" }}
                        style={{ originX: 0 }}
                        className="mb-2 h-[2px] w-28 bg-gradient-to-r from-[#39FF14] to-transparent md:mb-3 md:w-36"
                    />

                    <motion.p
                        initial={{ opacity: 0 }}
                        animate={booted ? { opacity: 1 } : {}}
                        transition={{ delay: 0.7 }}
                        className="mb-2 font-mono text-[10px] uppercase tracking-[0.22em] text-on-surface-variant md:mb-2"
                    >
                        PHHS HACK CLUB // BERGEN COUNTY, NJ
                    </motion.p>
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={booted ? { opacity: 1 } : {}}
                        transition={{ delay: 0.85 }}
                        className="mb-3 min-h-[1.5rem] max-w-sm font-mono text-sm text-[#39FF14]/80 md:mb-4 md:max-w-md md:text-[14px]"
                    >
                        {booted && (
                            <GlitchTyper
                                text="SOFTWARE HACKATHON. SAME DAY. ARRIVE READY TO SHIP."
                                delay={900}
                                speed={22}
                            />
                        )}
                    </motion.div>

                    <motion.div
                        initial={{ opacity: 0, y: 16 }}
                        animate={booted ? { opacity: 1, y: 0 } : {}}
                        transition={{ delay: 1 }}
                        className="mb-4 flex flex-wrap gap-2 md:mb-5"
                    >
                        {SIGNAL_TAGS.map((tag, index) => (
                            <motion.span
                                key={tag}
                                initial={{ opacity: 0, y: 12, scale: 0.9 }}
                                animate={booted ? { opacity: 1, y: 0, scale: 1 } : {}}
                                transition={{ delay: 1.1 + index * 0.1, type: "spring", stiffness: 200 }}
                                whileHover={{ y: -3, borderColor: "rgba(57,255,20,0.5)", scale: 1.04 }}
                                className="border border-[#39FF14]/20 bg-black/20 px-3 py-2 font-mono text-[10px] uppercase tracking-[0.2em] text-on-surface-variant"
                            >
                                {tag}
                            </motion.span>
                        ))}
                    </motion.div>

                    <motion.div
                        initial={{ opacity: 0, y: 16 }}
                        animate={booted ? { opacity: 1, y: 0 } : {}}
                        transition={{ delay: 0.9 }}
                        className="mb-4 flex flex-wrap gap-x-5 gap-y-3 md:mb-5 md:gap-x-7"
                    >
                        {[
                            { label: "THEME", display: "???" },
                            { label: "MAX_TEAM", val: 4, suffix: "" },
                            { label: "PRIZE_$", display: "???" },
                        ].map((s, index) => (
                            <motion.div
                                key={s.label}
                                initial={{ opacity: 0, y: 14 }}
                                animate={booted ? { opacity: 1, y: 0 } : {}}
                                transition={{ delay: 1.15 + index * 0.1 }}
                                whileHover={{ y: -5, scale: 1.03 }}
                                className="border-l-2 border-[#39FF14]/40 pl-3 md:pl-4"
                            >
                                <div className="font-mono text-lg font-bold text-on-surface md:text-2xl">
                                    {"display" in s ? (
                                        <span>{s.display}</span>
                                    ) : (
                                        <>
                                            {booted && <SlotNumber to={s.val} delay={1300} />}
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
                        initial={{ opacity: 0, y: 20, filter: "blur(6px)" }}
                        animate={booted ? { opacity: 1, y: 0, filter: "blur(0px)" } : {}}
                        transition={{ delay: 1.2, duration: 0.6 }}
                        className="inline-flex flex-wrap gap-3 border border-[#39FF14]/15 bg-black/35 p-3 backdrop-blur-sm md:gap-4"
                    >
                        <Link href={dashboardHref ?? "/auth/signup"}>
                            <motion.div
                                whileHover={{
                                    scale: 1.05,
                                    y: -4,
                                    boxShadow: "0 0 50px rgba(57,255,20,0.6), 0 0 100px rgba(57,255,20,0.2)",
                                }}
                                whileTap={{ scale: 0.96 }}
                                className="group flex cursor-pointer items-center gap-3 border border-[#98ff7a] bg-[#7cff64] px-6 py-3 font-mono text-xs font-bold tracking-[0.2em] text-[#041b00] uppercase shadow-[0_0_28px_rgba(124,255,100,0.28)] md:px-8 md:py-4"
                            >
                                {dashboardHref ? "OPEN_DASHBOARD" : "APPLY_NOW"}
                                <motion.span
                                    className="inline-block"
                                    animate={{ x: [0, 4, 0] }}
                                    transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}
                                >
                                    →
                                </motion.span>
                            </motion.div>
                        </Link>
                        <motion.a
                            href="#about"
                            whileHover={{
                                y: -3,
                                borderColor: "rgba(57,255,20,0.6)",
                                backgroundColor: "rgba(57,255,20,0.12)",
                            }}
                            className="border border-[#39FF14]/45 bg-black/45 px-6 py-3 font-mono text-xs tracking-[0.2em] text-[#efffe3] uppercase shadow-[0_0_18px_rgba(57,255,20,0.08)] transition-colors md:px-8 md:py-4"
                        >
                            VIEW_BRIEF
                        </motion.a>
                    </motion.div>
                </div>

                {/* 3D Scene */}
                <motion.div
                    initial={{ opacity: 0, filter: "blur(16px)" }}
                    animate={booted ? { opacity: 1, filter: "blur(0px)" } : {}}
                    transition={{ delay: 0.8, duration: 1.2, ease: [0.22, 1, 0.36, 1] }}
                    className="relative hidden w-full self-center md:block md:h-[30rem] lg:h-[34rem] xl:h-[38rem]"
                >
                    <Suspense fallback={<div className="h-full w-full" />}>
                        <HeroScene />
                    </Suspense>
                </motion.div>
            </div>

            {/* Ticker */}
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={booted ? { opacity: 1, y: 0 } : {}}
                transition={{ delay: 1.5, duration: 0.5 }}
                className="absolute bottom-0 left-0 z-20 w-full overflow-hidden whitespace-nowrap border-t border-[#39FF14]/10 bg-[#0a0a0a]/80 py-2 backdrop-blur-sm"
            >
                <div className="animate-marquee font-mono text-[9px] text-[#39FF14]/60 tracking-[0.25em] uppercase">
                    {(TICKER + "  ").repeat(5)}
                </div>
            </motion.div>
        </section>
    );
}
