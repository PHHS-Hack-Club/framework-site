"use client";

import { useRef } from "react";
import { motion, useInView } from "framer-motion";
import { fadeUpLarge, stagger, staggerSlow, revealLine } from "@/app/lib/animations";

type ScheduleEvent = {
    id: string;
    title: string;
    location: string | null;
    day: number;
    startTime: string;
    endTime: string | null;
    tag: string | null;
};

type DayGroup = {
    day: string;
    events: ScheduleEvent[];
};

const eventVariant = {
    hidden: (i: number) => ({
        opacity: 0,
        x: i % 2 === 0 ? -40 : 40,
        filter: "blur(6px)",
    }),
    show: (i: number) => ({
        opacity: 1,
        x: 0,
        filter: "blur(0px)",
        transition: {
            duration: 0.6,
            delay: i * 0.08,
            ease: [0.22, 1, 0.36, 1] as const,
        },
    }),
};

export default function ScheduleSectionClient({ groups }: { groups: DayGroup[] }) {
    const ref = useRef(null);
    const inView = useInView(ref, { once: true, margin: "-100px" });

    return (
        <section
            id="schedule"
            ref={ref}
            className="py-24 px-8 md:px-24 bg-surface-container-lowest"
        >
            <motion.div
                variants={stagger}
                initial="hidden"
                animate={inView ? "show" : "hidden"}
                className="mb-16 text-center"
            >
                <motion.h2
                    variants={fadeUpLarge}
                    className="text-4xl md:text-6xl font-black italic tracking-tighter uppercase"
                >
                    SEQUENCE_TIMELINE
                </motion.h2>
                <motion.p
                    variants={fadeUpLarge}
                    className="mx-auto mt-5 max-w-2xl font-mono text-sm leading-7 text-on-surface-variant"
                >
                    Prepare before you arrive, then expect a single-day push on site. The theme, team
                    flow, and project submission window all go live day-of.
                </motion.p>
                <motion.div
                    variants={revealLine}
                    className="mx-auto mt-6 h-[2px] w-20 bg-gradient-to-r from-transparent via-[#39FF14] to-transparent"
                />
            </motion.div>

            <div className="max-w-4xl mx-auto space-y-12">
                {groups.map((group, di) => (
                    <motion.div
                        key={group.day}
                        variants={staggerSlow}
                        initial="hidden"
                        animate={inView ? "show" : "hidden"}
                        custom={di}
                    >
                        <motion.div
                            initial={{ opacity: 0, x: -30 }}
                            animate={inView ? { opacity: 1, x: 0 } : {}}
                            transition={{ delay: di * 0.3 + 0.2, duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
                            className="text-[#39FF14] font-mono text-sm tracking-widest mb-6 uppercase flex items-center gap-2"
                        >
                            <motion.span
                                initial={{ scaleX: 0 }}
                                animate={inView ? { scaleX: 1 } : {}}
                                transition={{ delay: di * 0.3 + 0.4, duration: 0.8 }}
                                style={{ originX: 0 }}
                                className="w-8 h-[1px] bg-[#39FF14]"
                            />
                            {group.day}
                        </motion.div>

                        <div className="space-y-0">
                            {group.events.map((ev, ei) => (
                                <motion.div
                                    key={ev.id}
                                    custom={ei}
                                    variants={eventVariant}
                                    initial="hidden"
                                    animate={inView ? "show" : "hidden"}
                                    whileHover={{
                                        x: 8,
                                        y: -2,
                                        backgroundColor: "rgba(57,255,20,0.04)",
                                        borderColor: "rgba(57,255,20,0.15)",
                                    }}
                                    className={`flex justify-between items-center p-6 border-b border-outline-variant/10 ${
                                        ei % 2 === 0 ? "bg-surface-container" : "bg-surface"
                                    } transition-all cursor-default`}
                                >
                                    <motion.span
                                        className="font-mono text-[#39FF14] w-16 shrink-0"
                                        whileHover={{ scale: 1.1 }}
                                    >
                                        {ev.startTime}
                                    </motion.span>
                                    <span className="font-bold uppercase tracking-tight flex-1 px-4">
                                        {ev.title}
                                    </span>
                                    {ev.tag ? (
                                        <motion.span
                                            animate={ev.tag === "LIVE" ? { opacity: [1, 0.35, 1] } : undefined}
                                            transition={ev.tag === "LIVE" ? { duration: 1, repeat: Infinity } : undefined}
                                            className={`text-xs font-mono uppercase ${
                                                ev.tag === "LIVE"
                                                    ? "text-[#39FF14]"
                                                    : ev.tag === "REQUIRED"
                                                      ? "text-[#ffd3ce]"
                                                      : "text-[#baccb0]"
                                            }`}
                                        >
                                            {ev.tag}
                                        </motion.span>
                                    ) : ev.location ? (
                                        <span className="text-xs font-mono text-on-surface-variant hidden md:block">
                                            {ev.location}
                                        </span>
                                    ) : null}
                                </motion.div>
                            ))}
                        </div>
                    </motion.div>
                ))}
            </div>
        </section>
    );
}
