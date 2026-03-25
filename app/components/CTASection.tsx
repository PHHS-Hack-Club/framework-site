"use client";

import { useRef } from "react";
import { motion, useInView } from "framer-motion";
import { fadeUpLarge as fadeUp, stagger } from "@/app/lib/animations";


export default function CTASection() {
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
            {/* Background grid */}
            <div
                className="absolute inset-0 opacity-20"
                style={{
                    backgroundImage: "radial-gradient(#3c4b35 1px, transparent 1px)",
                    backgroundSize: "32px 32px",
                }}
            />

            {/* Scanlines */}
            <div className="absolute inset-0 scanline-overlay pointer-events-none" />

            <motion.div
                variants={stagger}
                initial="hidden"
                animate={inView ? "show" : "hidden"}
                className="relative z-10 flex flex-col items-center"
            >
                <motion.h2
                    variants={fadeUp}
                    className="text-5xl md:text-8xl font-black italic tracking-tighter uppercase mb-8 glitch-hover glitch-effect cursor-default"
                    data-text="READY_TO_BUILD?"
                >
                    READY_TO_BUILD?
                </motion.h2>

                <motion.p
                    variants={fadeUp}
                    className="font-mono text-on-surface-variant mb-12 max-w-xl mx-auto"
                >
                    Applications are currently open for all operational roles. Secure your
                    slot before the buffer fills up.
                </motion.p>

                <motion.button
                    variants={fadeUp}
                    whileHover={{
                        scale: 1.02,
                        boxShadow: "0 0 60px rgba(57,255,20,0.6)",
                    }}
                    whileTap={{ scale: 0.97 }}
                    className="bg-primary-container text-on-primary px-16 py-6 font-headline font-black text-2xl tracking-tighter shadow-[0_0_50px_rgba(57,255,20,0.5)] glow-breathe"
                    id="cta-button"
                >
                    EXECUTE_APPLICATION
                </motion.button>

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
                    APPLICATIONS_OPEN // SLOTS_AVAILABLE: 128
                </motion.div>
            </motion.div>
        </section>
    );
}
