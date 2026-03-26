"use client";

import { useRef } from "react";
import { motion, useInView } from "framer-motion";
import Link from "next/link";
import { fadeUpLarge as fadeUp, stagger, scaleUp } from "@/app/lib/animations";


export default function CTASection({ dashboardHref }: { dashboardHref: string | null }) {
    const ref = useRef(null);
    const inView = useInView(ref, { once: true, margin: "-80px" });

    return (
        <section
            ref={ref}
            className="py-32 px-8 flex flex-col items-center justify-center text-center relative overflow-hidden"
            style={{
                background:
                    "linear-gradient(to top, rgba(57,255,20,0.08) 0%, transparent 100%)",
            }}
        >
            <div
                className="absolute inset-0 opacity-20"
                style={{
                    backgroundImage: "radial-gradient(#3c4b35 1px, transparent 1px)",
                    backgroundSize: "32px 32px",
                }}
            />
            <motion.div
                animate={{ scale: [0.92, 1.06, 0.92], opacity: [0.18, 0.35, 0.18] }}
                transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
                className="pointer-events-none absolute left-1/2 top-1/2 h-[28rem] w-[28rem] -translate-x-1/2 -translate-y-1/2 rounded-full bg-[radial-gradient(circle,rgba(57,255,20,0.14),transparent_68%)] blur-3xl"
            />
            <motion.div
                animate={{ rotate: [0, 8, 0], scale: [1, 1.04, 1] }}
                transition={{ duration: 10, repeat: Infinity, ease: "easeInOut" }}
                className="pointer-events-none absolute left-1/2 top-1/2 h-[24rem] w-[24rem] -translate-x-1/2 -translate-y-1/2 border border-[#39FF14]/10"
            />

            {/* Animated corner brackets */}
            <motion.div
                initial={{ opacity: 0 }}
                animate={inView ? { opacity: 1 } : {}}
                transition={{ delay: 0.6, duration: 0.8 }}
                className="pointer-events-none absolute inset-8 md:inset-16 z-10"
            >
                <div className="absolute top-0 left-0 w-8 h-8 border-t-2 border-l-2 border-[#39FF14]/20" />
                <div className="absolute top-0 right-0 w-8 h-8 border-t-2 border-r-2 border-[#39FF14]/20" />
                <div className="absolute bottom-0 left-0 w-8 h-8 border-b-2 border-l-2 border-[#39FF14]/20" />
                <div className="absolute bottom-0 right-0 w-8 h-8 border-b-2 border-r-2 border-[#39FF14]/20" />
            </motion.div>

            <div className="absolute inset-0 scanline-overlay pointer-events-none" />

            <motion.div
                variants={stagger}
                initial="hidden"
                animate={inView ? "show" : "hidden"}
                className="relative z-10 flex flex-col items-center"
            >
                <motion.h2
                    variants={scaleUp}
                    className="text-5xl md:text-8xl font-black italic tracking-tighter uppercase mb-8 glitch-hover glitch-effect cursor-default"
                    data-text="READY_TO_BUILD?"
                >
                    READY_TO_BUILD?
                </motion.h2>

                <motion.p
                    variants={fadeUp}
                    className="font-mono text-on-surface-variant mb-12 max-w-xl mx-auto"
                >
                    Applications are open for Bergen County students who can already ship code. Same-day format, software-only, theme revealed day-of.
                </motion.p>

                <Link href={dashboardHref ?? "/auth/signup"}>
                    <motion.div
                        variants={fadeUp}
                        whileHover={{
                            scale: 1.06,
                            y: -6,
                            boxShadow: "0 0 80px rgba(57,255,20,0.7), 0 0 160px rgba(57,255,20,0.3)",
                        }}
                        whileTap={{ scale: 0.95 }}
                        className="cursor-pointer bg-primary-container px-16 py-6 font-headline text-2xl font-black tracking-tighter text-on-primary shadow-[0_0_50px_rgba(57,255,20,0.5)] glow-breathe"
                        id="cta-button"
                    >
                        {dashboardHref ? "OPEN_DASHBOARD" : "START_APPLICATION"}
                    </motion.div>
                </Link>

                {/* Status blip */}
                <motion.div
                    variants={fadeUp}
                    className="mt-10 flex items-center gap-3 font-mono text-xs text-on-surface-variant tracking-widest uppercase"
                >
                    <motion.span
                        animate={{ scale: [1, 1.4, 1], opacity: [1, 0.5, 1] }}
                        transition={{ duration: 1.5, repeat: Infinity }}
                        className="w-2 h-2 rounded-full bg-[#39FF14]"
                    />
                    APPLICATIONS_OPEN // THEME_DAY_OF // SOFTWARE_ONLY
                </motion.div>
            </motion.div>
        </section>
    );
}
