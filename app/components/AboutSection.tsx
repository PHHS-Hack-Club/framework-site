"use client";

import { useRef } from "react";
import { motion, useInView } from "framer-motion";
import { fadeUp, fadeUpLarge, cardFan, stagger, staggerWide, revealLine } from "@/app/lib/animations";


const bentoCards = [
    {
        id: "main",
        span: "md:col-span-2",
        icon: "code",
        title: "SAME_DAY_SOFTWARE_SPRINT",
        body: "Framework 2027 is a same-day software hackathon for Bergen County students who already know how to build. The theme is revealed on-site at the opening brief — teams form up, lock in a project, and ship it within the day. No overnight. No hardware. Just code.",
        tags: ["Students_Only", "Software_Only", "Theme_Drops_DayOf"],
        highlight: true,
        topBorder: false,
    },
    {
        id: "wifi",
        span: "",
        icon: "wifi",
        title: "VENUE_WIFI_AVAILABLE",
        body: "Venue Wi-Fi will be available. Show up with your tools installed, your stack ready, and your environment stable so you can start building immediately.",
        tags: [],
        highlight: false,
        topBorder: true,
    },
    {
        id: "prizes",
        span: "md:col-span-2",
        icon: "emoji_events",
        title: "PRIZES_AND_JUDGING",
        body: "Prize pool: ???. Projects are evaluated on execution quality, technical depth, and fit to the released prompt. Judging happens same-day and results are announced at the closing ceremony.",
        tags: [],
        highlight: false,
        topBorder: true,
    },
    {
        id: "experienced",
        span: "",
        icon: "terminal",
        title: "READY_TO_BUILD",
        body: "This event assumes you can already write and ship code independently. Expect peer-level competition with minimal hand-holding — show up knowing your stack.",
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
                    variants={fadeUpLarge}
                    className="text-4xl md:text-6xl font-black italic tracking-tighter uppercase mb-4 text-center md:text-left"
                >
                    MISSION_OBJECTIVE
                </motion.h2>
                <motion.div
                    variants={revealLine}
                    style={{ originX: 0 }}
                    className="h-1 w-24 bg-primary-container glow-breathe"
                />
            </motion.div>

            {/* Bento grid */}
            <motion.div
                variants={staggerWide}
                initial="hidden"
                animate={inView ? "show" : "hidden"}
                className="grid grid-cols-1 md:grid-cols-3 gap-6"
                style={{ perspective: "1200px" }}
            >
                {bentoCards.map((card) => (
                    <motion.div
                        key={card.id}
                        variants={cardFan}
                        whileHover={{
                            scale: 1.02,
                            y: -10,
                            rotateX: 3,
                            boxShadow: "0 20px 60px rgba(57,255,20,0.08), 0 0 1px rgba(57,255,20,0.3)",
                        }}
                        transition={{ type: "spring", stiffness: 220, damping: 20 }}
                        className={`${card.span} bg-surface-container-high p-8 flex flex-col justify-between relative overflow-hidden group cursor-default ${card.topBorder ? "border-t-4 border-[#39FF14]" : ""
                            }`}
                    >
                        {card.highlight && (
                            <motion.div
                                initial={{ opacity: 0, scale: 0.8 }}
                                animate={inView ? { opacity: 0.05, scale: 1 } : {}}
                                transition={{ delay: 0.8, duration: 1.2 }}
                                className="absolute top-0 right-0 p-8 group-hover:opacity-10 transition-opacity pointer-events-none"
                            >
                                <span className="material-symbols-outlined text-[10rem]">
                                    {card.icon}
                                </span>
                            </motion.div>
                        )}

                        <div>
                            <motion.span
                                className="material-symbols-outlined text-[#39FF14] mb-4 glow-breathe block"
                                transition={{ type: "spring", stiffness: 300 }}
                            >
                                {card.icon}
                            </motion.span>
                            <h3
                                className={`font-bold uppercase mb-4 ${card.highlight
                                    ? "text-2xl text-[#39FF14]"
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
                                {card.tags.map((tag, i) => (
                                    <motion.span
                                        key={tag}
                                        initial={{ opacity: 0, x: -10 }}
                                        animate={inView ? { opacity: 1, x: 0 } : {}}
                                        transition={{ delay: 1.2 + i * 0.1 }}
                                        whileHover={{ scale: 1.08, borderColor: "rgba(57,255,20,0.5)" }}
                                        className="text-[10px] font-mono border border-outline-variant px-2 py-1 uppercase"
                                    >
                                        {tag}
                                    </motion.span>
                                ))}
                            </div>
                        )}

                        {/* Hover glow line at bottom */}
                        <motion.div
                            className="absolute bottom-0 left-0 h-[2px] bg-[#39FF14] w-0 group-hover:w-full transition-all duration-700"
                        />
                    </motion.div>
                ))}

            </motion.div>
        </section>
    );
}
