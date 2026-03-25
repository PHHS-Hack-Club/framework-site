"use client";

import { useRef } from "react";
import { motion, useInView } from "framer-motion";
import { fadeUp, stagger } from "@/app/lib/animations";

const specs = [
    {
        icon: "location_on",
        text: "225 W Grand Ave, Montvale, NJ 07645",
    },
    {
        icon: "wifi",
        text: "GIGABIT_FIBER_ENABLED",
    },
    {
        icon: "hardware",
        text: "HARDWARE_LAB_ACCESS",
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
            {/* Map / graphic */}
            <motion.div
                variants={fadeUp}
                initial="hidden"
                animate={inView ? "show" : "hidden"}
                className="relative group"
            >
                <div className="absolute -inset-4 border border-[#39FF14]/20 opacity-0 group-hover:opacity-100 transition-opacity duration-500 z-10 pointer-events-none" />

                {/* Wireframe 3D map visualization */}
                <div className="w-full aspect-square bg-[#0a0a0a] border border-outline-variant/20 relative overflow-hidden flex items-center justify-center">
                    {/* Grid overlay */}
                    <div
                        className="absolute inset-0 opacity-30"
                        style={{
                            backgroundImage:
                                "linear-gradient(rgba(57,255,20,0.15) 1px, transparent 1px), linear-gradient(90deg, rgba(57,255,20,0.15) 1px, transparent 1px)",
                            backgroundSize: "32px 32px",
                        }}
                    />

                    {/* Animated radar rings */}
                    {[1, 2, 3, 4].map((i) => (
                        <motion.div
                            key={i}
                            className="absolute border border-[#39FF14]/20 rounded-full"
                            style={{
                                width: `${i * 25}%`,
                                height: `${i * 25}%`,
                            }}
                            animate={{ scale: [1, 1.02, 1], opacity: [0.4, 0.2, 0.4] }}
                            transition={{
                                duration: 3,
                                repeat: Infinity,
                                delay: i * 0.4,
                                ease: "easeInOut",
                            }}
                        />
                    ))}

                    {/* Cross hairs */}
                    <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                        <div className="w-full h-[1px] bg-[#39FF14]/20" />
                    </div>
                    <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                        <div className="w-[1px] h-full bg-[#39FF14]/20" />
                    </div>

                    {/* Target dot */}
                    <motion.div
                        animate={{ scale: [1, 1.3, 1], opacity: [1, 0.7, 1] }}
                        transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}
                        className="w-3 h-3 rounded-full bg-[#39FF14] shadow-[0_0_20px_#39FF14] relative z-10"
                    />

                    {/* Coordinate overlay */}
                    <div className="absolute top-4 left-4 bg-surface/90 backdrop-blur-md p-4 border-l-2 border-[#39FF14] z-20">
                        <div className="font-mono text-xs text-on-surface-variant mb-1">
                            TARGET_COORDINATES
                        </div>
                        <div className="font-mono text-lg text-primary-container font-bold flicker">
                            41.05° N, 74.05° W
                        </div>
                    </div>

                    {/* Scanning line */}
                    <motion.div
                        className="absolute left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-[#39FF14]/60 to-transparent"
                        animate={{ top: ["0%", "100%", "0%"] }}
                        transition={{ duration: 4, repeat: Infinity, ease: "linear" }}
                    />
                </div>
            </motion.div>

            {/* Text content */}
            <motion.div
                variants={stagger}
                initial="hidden"
                animate={inView ? "show" : "hidden"}
            >
                <motion.h2
                    variants={fadeUp}
                    className="text-4xl md:text-6xl font-black italic tracking-tighter mb-8 uppercase"
                >
                    THE HUB
                </motion.h2>
                <motion.p
                    variants={fadeUp}
                    className="font-mono text-on-surface-variant text-lg mb-8 leading-relaxed"
                >
                    Operations will be hosted at{" "}
                    <span className="text-on-surface font-bold">
                        Pascack Hills High School
                    </span>{" "}
                    in Montvale, NJ. The campus will be transformed into a high-density
                    creative terminal for 24 continuous hours.
                </motion.p>

                <motion.div variants={stagger} className="space-y-4">
                    {specs.map((spec) => (
                        <motion.div
                            key={spec.icon}
                            variants={fadeUp}
                            className="flex items-center gap-4 p-4 bg-surface border-l-2 border-outline-variant hover:border-[#39FF14] transition-colors group cursor-default"
                            whileHover={{ x: 4 }}
                        >
                            <span className="material-symbols-outlined text-[#39FF14]">
                                {spec.icon}
                            </span>
                            <span className="font-mono text-sm">{spec.text}</span>
                        </motion.div>
                    ))}
                </motion.div>
            </motion.div>
        </section>
    );
}
