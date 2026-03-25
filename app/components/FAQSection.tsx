"use client";

import { useRef, useState } from "react";
import { motion, useInView, AnimatePresence } from "framer-motion";
import { fadeUp, stagger } from "@/app/lib/animations";


const faqs = [
    {
        id: "01",
        q: "WHO_IS_THIS_FOR?",
        a: "High school students residing in or attending school within Bergen County are eligible, but this event assumes you already know how to code. It is not designed as an introduction to programming.",
    },
    {
        id: "02",
        q: "WHEN_DO_WE_GET_THE_THEME?",
        a: "Day-of. Organizers reveal the theme during the opening brief, then unlock the project flow for teams to form and start shipping against it.",
    },
    {
        id: "03",
        q: "HOW_DO_TEAMS_WORK?",
        a: "Team creation and joining happen inside the project submission flow, not on a separate page. That full flow only opens when organizers unlock it on event day.",
    },
    {
        id: "04",
        q: "WHAT_KIND_OF_PROJECTS?",
        a: "Software only. This is not a hardware hackathon, so do not build your plan around physical fabrication, soldering, or device labs.",
    },
];

function FAQItem({ faq }: { faq: (typeof faqs)[0] }) {
    const [open, setOpen] = useState(false);

    return (
        <motion.div
            variants={fadeUp}
            whileHover={{ y: -4, borderColor: "rgba(57,255,20,0.24)" }}
            className="bg-surface-container-high border border-outline-variant/10 overflow-hidden transition-colors"
        >
            <button
                onClick={() => setOpen((p) => !p)}
                className="w-full text-left p-6 flex items-center justify-between group"
            >
                <div className="font-bold text-lg text-primary-container uppercase flicker">
                    {faq.id}
                    {" // "}
                    {faq.q}
                </div>
                <motion.span
                    animate={{ rotate: open ? 45 : 0 }}
                    transition={{ duration: 0.25 }}
                    className="text-[#39FF14] text-2xl font-mono shrink-0 ml-4"
                >
                    +
                </motion.span>
            </button>

            <AnimatePresence initial={false}>
                {open && (
                    <motion.div
                        key="answer"
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: "auto", opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.3, ease: "easeInOut" }}
                        className="overflow-hidden"
                    >
                        <p className="px-6 pb-6 font-mono text-sm leading-7 text-on-surface-variant">
                            {faq.a}
                        </p>
                    </motion.div>
                )}
            </AnimatePresence>
        </motion.div>
    );
}

export default function FAQSection() {
    const ref = useRef(null);
    const inView = useInView(ref, { once: true, margin: "-100px" });

    return (
        <section
            id="faq"
            ref={ref}
            className="py-24 px-8 md:px-24 bg-surface"
        >
            <div className="flex flex-col md:flex-row gap-16">
                {/* Left header */}
                <motion.div
                    variants={stagger}
                    initial="hidden"
                    animate={inView ? "show" : "hidden"}
                    className="md:w-1/3"
                >
                    <motion.h2
                        variants={fadeUp}
                        className="text-4xl md:text-6xl font-black italic tracking-tighter uppercase mb-6 leading-none"
                    >
                        QUERY_LOGS
                    </motion.h2>
                    <motion.p
                        variants={fadeUp}
                        className="font-mono text-on-surface-variant text-sm"
                    >
                        The constraints matter more than the marketing. Here is the actual operating
                        brief.
                    </motion.p>
                </motion.div>

                {/* FAQ items */}
                <motion.div
                    variants={stagger}
                    initial="hidden"
                    animate={inView ? "show" : "hidden"}
                    className="md:w-2/3 space-y-6"
                >
                    {faqs.map((faq) => (
                        <FAQItem key={faq.id} faq={faq} />
                    ))}
                </motion.div>
            </div>
        </section>
    );
}
