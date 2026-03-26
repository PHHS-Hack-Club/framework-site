"use client";

import { useRef, lazy, Suspense } from "react";
import { motion, useInView } from "framer-motion";
import { slideFromLeft, slideFromRight, fadeUp, stagger, staggerSlow } from "@/app/lib/animations";

const SatelliteMap = lazy(() => import("./SatelliteMap"));

const specs = [
    {
        icon: "location_on",
        text: "225 W Grand Ave, Montvale, NJ 07645",
    },
    {
        icon: "terminal",
        text: "SOFTWARE_PROJECTS_ONLY",
    },
    {
        icon: "badge",
        text: "SCHOOL_ID_REQUIRED — No ID, no entry.",
    },
];

export default function LocationSection() {
    const ref = useRef(null);
    const inView = useInView(ref, { once: true, margin: "-100px" });

    return (
        <section
            id="hub"
            ref={ref}
            className="py-24 px-8 md:px-24 bg-surface-container-lowest grid grid-cols-1 md:grid-cols-2 gap-16 items-center"
        >
            {/* Map / graphic — slides in from left */}
            <motion.div
                variants={slideFromLeft}
                initial="hidden"
                animate={inView ? "show" : "hidden"}
                whileHover={{ y: -8, scale: 1.01 }}
                transition={{ type: "spring", stiffness: 200, damping: 20 }}
                className="relative group"
            >
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={inView ? { opacity: 1 } : { opacity: 0 }}
                    transition={{ delay: 0.6, duration: 0.8 }}
                    className="absolute -inset-4 border border-[#39FF14]/20 opacity-0 group-hover:opacity-100 transition-opacity duration-500 z-10 pointer-events-none"
                />

                <Suspense fallback={
                    <div className="w-full aspect-square bg-[#0a0a0a] border border-outline-variant/20 flex items-center justify-center font-mono text-xs text-on-surface-variant animate-pulse">
                        LOADING_MAP...
                    </div>
                }>
                    <SatelliteMap />
                </Suspense>
            </motion.div>

            {/* Text content — slides in from right */}
            <motion.div
                variants={staggerSlow}
                initial="hidden"
                animate={inView ? "show" : "hidden"}
            >
                <motion.h2
                    variants={slideFromRight}
                    className="text-4xl md:text-6xl font-black italic tracking-tighter mb-8 uppercase"
                >
                    THE HUB
                </motion.h2>
                <motion.p
                    variants={slideFromRight}
                    className="font-mono text-on-surface-variant text-lg mb-8 leading-relaxed"
                >
                    <span className="text-on-surface font-bold">Pascack Hills High School</span>
                    {" "}in Montvale, NJ. The campus becomes a one-day software build floor — not an overnight stay, not a hardware lab. You arrive, the theme drops, you ship.
                </motion.p>
                <motion.div
                    variants={slideFromRight}
                    whileHover={{ y: -4, borderColor: "rgba(57,255,20,0.38)", boxShadow: "0 0 20px rgba(57,255,20,0.1)" }}
                    className="mb-8 border border-[#39FF14]/15 bg-black/20 p-4 font-mono text-xs uppercase tracking-[0.2em] text-on-surface-variant"
                >
                    Bring a charged laptop, your full dev environment, all dependencies cached offline, and{" "}
                    <strong style={{ color: "#e5e2e1" }}>your physical school ID</strong>.
                </motion.div>

                <motion.div variants={stagger} className="space-y-4">
                    {specs.map((spec, i) => (
                        <motion.div
                            key={spec.icon}
                            variants={fadeUp}
                            custom={i}
                            className="flex items-center gap-4 p-4 bg-surface border-l-2 border-outline-variant hover:border-[#39FF14] transition-all group cursor-default"
                            whileHover={{
                                x: 12,
                                y: -2,
                                borderColor: "#39FF14",
                                boxShadow: "0 4px 20px rgba(57,255,20,0.08)",
                            }}
                        >
                            <motion.span
                                className="material-symbols-outlined text-[#39FF14]"
                                whileHover={{ scale: 1.2, rotate: 8 }}
                            >
                                {spec.icon}
                            </motion.span>
                            <span className="font-mono text-sm">{spec.text}</span>
                        </motion.div>
                    ))}
                </motion.div>
            </motion.div>
        </section>
    );
}
