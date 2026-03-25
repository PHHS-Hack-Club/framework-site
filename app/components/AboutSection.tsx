"use client";

import { useRef } from "react";
import { motion, useInView } from "framer-motion";
import { fadeUp, stagger } from "@/app/lib/animations";


const bentoCards = [
    {
        id: "main",
        span: "md:col-span-2",
        icon: "code",
        title: "24_HOUR_CRITICAL_HACK",
        body: "Framework 2027 is the premier hackathon for Bergen County students. We've stripped away the corporate fluff to focus on what matters: pure building. Whether you're soldering custom PCBs or architecting distributed systems, this is your arena.",
        tags: ["Students_Only", "Free_Entry", "Open_Source"],
        highlight: true,
        topBorder: false,
    },
    {
        id: "hw",
        span: "",
        icon: "memory",
        title: "HARDWARE_LAB",
        body: "Access to 3D printers, soldering irons, and a massive components library for your physical prototypes.",
        tags: [],
        highlight: false,
        topBorder: true,
    },
    {
        id: "dev",
        span: "",
        icon: "terminal",
        title: "DEV_STATIONS",
        body: "Dedicated high-speed zones with secondary monitors and ergonomic peripherals for intense coding sprints.",
        tags: [],
        highlight: false,
        topBorder: false,
    },
];

export default function AboutSection() {
    const ref = useRef(null);
    const inView = useInView(ref, { once: true, margin: "-100px" });

    return (
        <section
            id="about"
            ref={ref}
            className="py-24 px-8 md:px-24 bg-surface"
        >
            {/* Header */}
            <motion.div
                variants={stagger}
                initial="hidden"
                animate={inView ? "show" : "hidden"}
                className="mb-16"
            >
                <motion.h2
                    variants={fadeUp}
                    className="text-4xl md:text-6xl font-black italic tracking-tighter uppercase mb-4 text-center md:text-left"
                >
                    MISSION_OBJECTIVE
                </motion.h2>
                <motion.div
                    variants={fadeUp}
                    className="h-1 w-24 bg-primary-container glow-breathe"
                />
            </motion.div>

            {/* Bento grid */}
            <motion.div
                variants={stagger}
                initial="hidden"
                animate={inView ? "show" : "hidden"}
                className="grid grid-cols-1 md:grid-cols-3 gap-6"
            >
                {bentoCards.map((card) => (
                    <motion.div
                        key={card.id}
                        variants={fadeUp}
                        whileHover={{ scale: 1.01, y: -2 }}
                        className={`${card.span} bg-surface-container-high p-8 flex flex-col justify-between relative overflow-hidden group cursor-default ${card.topBorder ? "border-t-4 border-[#39FF14]" : ""
                            }`}
                    >
                        {card.highlight && (
                            <div className="absolute top-0 right-0 p-8 opacity-5 group-hover:opacity-10 transition-opacity pointer-events-none">
                                <span className="material-symbols-outlined text-[10rem]">
                                    {card.icon}
                                </span>
                            </div>
                        )}

                        <div>
                            <span className="material-symbols-outlined text-[#39FF14] mb-4 glow-breathe block">
                                {card.icon}
                            </span>
                            <h3
                                className={`font-bold uppercase mb-4 ${card.highlight
                                    ? "text-2xl text-[#39FF14] flicker"
                                    : "text-xl"
                                    }`}
                            >
                                {card.title}
                            </h3>
                            <p
                                className={`text-on-surface-variant font-mono leading-relaxed ${card.highlight ? "mb-6" : "text-sm"
                                    }`}
                            >
                                {card.body}
                            </p>
                        </div>

                        {card.tags.length > 0 && (
                            <div className="flex flex-wrap gap-4">
                                {card.tags.map((tag) => (
                                    <span
                                        key={tag}
                                        className="text-[10px] font-mono border border-outline-variant px-2 py-1 uppercase"
                                    >
                                        {tag}
                                    </span>
                                ))}
                            </div>
                        )}
                    </motion.div>
                ))}

                {/* Wide network card */}
                <motion.div
                    variants={fadeUp}
                    whileHover={{ scale: 1.01 }}
                    className="md:col-span-2 bg-surface-container-highest p-8 flex items-center justify-between group cursor-default"
                >
                    <div>
                        <h3 className="text-xl font-bold uppercase mb-2">
                            NETWORK_ACCESS
                        </h3>
                        <p className="text-sm font-mono text-on-surface-variant max-w-md">
                            Private VLANs for every team. No throttles. No filters. Just raw
                            bandwidth.
                        </p>
                    </div>
                    <motion.div
                        className="text-[#39FF14] font-mono text-4xl font-bold flicker ml-8 shrink-0"
                        animate={{ opacity: [1, 0.4, 1] }}
                        transition={{ duration: 4, repeat: Infinity, ease: "linear" }}
                    >
                        10_Gbps
                    </motion.div>
                </motion.div>
            </motion.div>
        </section>
    );
}
