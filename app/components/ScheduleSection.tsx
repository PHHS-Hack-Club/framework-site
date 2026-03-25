"use client";

import { useRef } from "react";
import { motion, useInView } from "framer-motion";
import { fadeUp, stagger } from "@/app/lib/animations";


const schedule = [
    {
        day: "PREP_WINDOW",
        events: [
            { time: "T-7D", label: "CACHE_DEPENDENCIES", location: "LOCAL_MACHINE", status: null },
            { time: "T-3D", label: "PREP_TEAM_OPTIONS", location: "SHARED_DOC", status: null },
            { time: "T-1D", label: "VERIFY_LOCAL_RUN_PATH", location: "TERMINAL", status: "REQUIRED" },
        ],
    },
    {
        day: "EVENT_DAY",
        events: [
            { time: "09:00", label: "CHECK_IN_AND_SETUP", location: "MAIN_LOBBY", status: null },
            { time: "10:00", label: "THEME_REVEAL_AND_BRIEF", location: "AUDITORIUM", status: null },
            { time: "10:15", label: "TEAM_AND_PROJECT_FLOW_OPEN", location: null, status: "LIVE" },
            { time: "10:30", label: "SOFTWARE_BUILD_WINDOW", location: null, status: null },
            { time: "17:00", label: "SUBMISSION_FREEZE", location: null, status: "LOCKED" },
            { time: "17:30", label: "PROJECT_JUDGING", location: "MAIN_FLOOR", status: null },
            { time: "18:30", label: "CLOSING_AND_AWARDS", location: "AUDITORIUM", status: null },
        ],
    },
];

export default function ScheduleSection() {
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
                    variants={fadeUp}
                    className="text-4xl md:text-6xl font-black italic tracking-tighter uppercase"
                >
                    SEQUENCE_TIMELINE
                </motion.h2>
                <motion.p
                    variants={fadeUp}
                    className="mx-auto mt-5 max-w-2xl font-mono text-sm leading-7 text-on-surface-variant"
                >
                    Prepare before you arrive, then expect a single-day push on site. The theme, team
                    flow, and project submission window all go live day-of.
                </motion.p>
            </motion.div>

            <div className="max-w-4xl mx-auto space-y-12">
                {schedule.map((day, di) => (
                    <motion.div
                        key={day.day}
                        variants={stagger}
                        initial="hidden"
                        animate={inView ? "show" : "hidden"}
                        custom={di}
                    >
                        <motion.div
                            variants={fadeUp}
                            className="text-[#39FF14] font-mono text-sm tracking-widest mb-6 uppercase flex items-center gap-2"
                        >
                            <span className="w-8 h-[1px] bg-[#39FF14]" />
                            {day.day}
                        </motion.div>

                        <div className="space-y-0">
                            {day.events.map((ev, ei) => (
                                <motion.div
                                    key={ev.time}
                                    variants={fadeUp}
                                    whileHover={{ x: 6, y: -2, backgroundColor: "rgba(57,255,20,0.04)" }}
                                    className={`flex justify-between items-center p-6 border-b border-outline-variant/10 ${ei % 2 === 0 ? "bg-surface-container" : "bg-surface"
                                        } transition-all cursor-default`}
                                >
                                    <span className="font-mono text-[#39FF14] w-16 shrink-0">
                                        {ev.time}
                                    </span>
                                    <span className="font-bold uppercase tracking-tight flex-1 px-4">
                                        {ev.label}
                                    </span>
                                    {ev.status ? (
                                        <motion.span
                                            animate={ev.status === "LIVE" ? { opacity: [1, 0.35, 1] } : undefined}
                                            transition={ev.status === "LIVE" ? { duration: 1, repeat: Infinity } : undefined}
                                            className={`text-xs font-mono uppercase ${
                                                ev.status === "LIVE"
                                                    ? "text-[#39FF14]"
                                                    : ev.status === "REQUIRED"
                                                      ? "text-[#ffd3ce]"
                                                      : "text-[#baccb0]"
                                            }`}
                                        >
                                            {ev.status}
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
