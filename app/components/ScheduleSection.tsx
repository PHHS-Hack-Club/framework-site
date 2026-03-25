"use client";

import { useRef } from "react";
import { motion, useInView } from "framer-motion";
import { fadeUp, stagger } from "@/app/lib/animations";


const schedule = [
    {
        day: "DAY_01: INITIALIZATION",
        events: [
            { time: "09:00", label: "OPERATOR_CHECK_IN", location: "MAIN_LOBBY", status: null },
            { time: "10:00", label: "SYSTEM_BOOT (OPENING)", location: "AUDITORIUM", status: null },
            { time: "11:00", label: "HACKING_START", location: null, status: "LIVE" },
            { time: "14:00", label: "HARDWARE_WORKSHOP_01", location: "LAB_7", status: null },
        ],
    },
    {
        day: "DAY_02: EXECUTION",
        events: [
            { time: "08:00", label: "BREAKFAST_PROTOCOL", location: "REFECTORY", status: null },
            { time: "11:00", label: "HACKING_END", location: null, status: "TERMINATED" },
            { time: "13:00", label: "PROJECT_JUDGING", location: "MAIN_FLOOR", status: null },
            { time: "15:00", label: "CLOSING_CEREMONY", location: "AUDITORIUM", status: null },
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
            <motion.h2
                variants={fadeUp}
                initial="hidden"
                animate={inView ? "show" : "hidden"}
                className="text-4xl md:text-6xl font-black italic tracking-tighter uppercase mb-16 text-center"
            >
                SEQUENCE_TIMELINE
            </motion.h2>

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
                                    whileHover={{ x: 4, backgroundColor: "rgba(57,255,20,0.03)" }}
                                    className={`flex justify-between items-center p-6 border-b border-outline-variant/10 ${ei % 2 === 0 ? "bg-surface-container" : "bg-surface"
                                        } transition-all cursor-default`}
                                >
                                    <span className="font-mono text-[#39FF14] w-16 shrink-0">
                                        {ev.time}
                                    </span>
                                    <span className="font-bold uppercase tracking-tight flex-1 px-4">
                                        {ev.label}
                                    </span>
                                    {ev.status === "LIVE" ? (
                                        <motion.span
                                            animate={{ opacity: [1, 0.3, 1] }}
                                            transition={{ duration: 1, repeat: Infinity }}
                                            className="text-xs font-mono text-[#39FF14] uppercase"
                                        >
                                            LIVE
                                        </motion.span>
                                    ) : ev.status === "TERMINATED" ? (
                                        <span className="text-xs font-mono text-error uppercase">
                                            TERMINATED
                                        </span>
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
