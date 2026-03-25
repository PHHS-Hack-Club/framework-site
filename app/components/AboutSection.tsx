"use client";

import { useRef } from "react";
import { motion, useInView } from "framer-motion";
import { fadeUp, stagger } from "@/app/lib/animations";


const bentoCards = [
    {
        id: "main",
        span: "md:col-span-2",
        icon: "code",
        title: "SAME_DAY_SOFTWARE_SPRINT",
        body: "Framework 2027 is a same-day software hackathon for Bergen County students who already know how to build. This is not an overnight stay and not a beginner workshop. The twist is day-of: the theme drops on site, then teams ship against it under pressure.",
        tags: ["Students_Only", "Software_Only", "Theme_Drops_DayOf"],
        highlight: true,
        topBorder: false,
    },
    {
        id: "offline",
        span: "",
        icon: "cloud_off",
        title: "OFFLINE_FIRST_STACK",
        body: "The venue internet will be there, but not reliably enough to build a cloud-dependent workflow from scratch. Cache packages, preload docs, and make sure your repo can move without a pristine connection.",
        tags: [],
        highlight: false,
        topBorder: true,
    },
    {
        id: "experienced",
        span: "",
        icon: "terminal",
        title: "READY_TO_BUILD",
        body: "Expect peer-level competition and minimal hand-holding. Teams form inside the project flow when organizers open it, so show up ready to lock in quickly.",
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
                        whileHover={{ scale: 1.015, y: -8, rotateX: 2.5 }}
                        transition={{ type: "spring", stiffness: 220, damping: 20 }}
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

            </motion.div>
        </section>
    );
}
