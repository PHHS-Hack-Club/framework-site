"use client";

import { useRef, useState } from "react";
import { motion, useInView, AnimatePresence } from "framer-motion";
import { fadeUp, slideFromLeft, slideFromRight, stagger, staggerSlow } from "@/app/lib/animations";


const faqs = [
    {
        id: "01",
        q: "WHO_IS_THIS_FOR?",
        a: "Bergen County high school students who already code independently. This is not an introduction to programming — if you're still learning the basics, this event isn't the right fit yet.",
    },
    {
        id: "02",
        q: "WHEN_DO_WE_GET_THE_THEME?",
        a: "Day-of, at the opening brief. Once the theme is revealed, organizers unlock the project flow and teams can form and start building. Nothing is shared before event day.",
    },
    {
        id: "03",
        q: "HOW_DO_TEAMS_WORK?",
        a: "Teams form inside the project submission flow after organizers unlock it on event day. There is no pre-registration for teams — you lock in your teammates on-site.",
    },
    {
        id: "04",
        q: "WHAT_KIND_OF_PROJECTS?",
        a: "Software only. This is not a hardware hackathon — don't build your plan around physical devices, soldering, or fabrication labs. Your project should run on a screen.",
    },
    {
        id: "05",
        q: "DO_I_NEED_MY_SCHOOL_ID?",
        a: "Yes, and this is enforced. Bring your physical school ID — no ID means no entry, no exceptions. You also upload a photo of it during the application so organizers can pre-verify you before the event.",
    },
];

function FAQItem({ faq, index }: { faq: (typeof faqs)[0]; index: number }) {
    const [open, setOpen] = useState(false);

    return (
        <motion.div
            variants={fadeUp}
            whileHover={{
                y: -4,
                borderColor: "rgba(57,255,20,0.24)",
                boxShadow: "0 8px 30px rgba(57,255,20,0.06)",
            }}
            className="bg-surface-container-high border border-outline-variant/10 overflow-hidden transition-colors"
        >
            <button
                onClick={() => setOpen((p) => !p)}
                className="w-full text-left p-6 flex items-center justify-between group"
            >
                <div className="font-bold text-lg text-primary-container uppercase">
                    <motion.span
                        className="inline-block mr-2 text-[#39FF14]/60 font-mono text-sm"
                        animate={open ? { rotate: 90 } : { rotate: 0 }}
                    >
                        {faq.id}
                    </motion.span>
                    {" // "}
                    {faq.q}
                </div>
                <motion.span
                    animate={{ rotate: open ? 45 : 0, scale: open ? 1.1 : 1 }}
                    transition={{ duration: 0.25, type: "spring", stiffness: 300 }}
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
                        transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
                        className="overflow-hidden"
                    >
                        <motion.div
                            initial={{ y: 10, opacity: 0 }}
                            animate={{ y: 0, opacity: 1 }}
                            exit={{ y: -10, opacity: 0 }}
                            transition={{ delay: 0.1, duration: 0.3 }}
                        >
                            <div className="h-[1px] mx-6 bg-gradient-to-r from-[#39FF14]/30 via-[#39FF14]/10 to-transparent" />
                            <p className="px-6 py-6 font-mono text-sm leading-7 text-on-surface-variant">
                                {faq.a}
                            </p>
                        </motion.div>
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
                {/* Left header — slides from left */}
                <motion.div
                    variants={stagger}
                    initial="hidden"
                    animate={inView ? "show" : "hidden"}
                    className="md:w-1/3"
                >
                    <motion.h2
                        variants={slideFromLeft}
                        className="text-4xl md:text-6xl font-black italic tracking-tighter uppercase mb-6 leading-none"
                    >
                        QUERY_LOGS
                    </motion.h2>
                    <motion.p
                        variants={slideFromLeft}
                        className="font-mono text-on-surface-variant text-sm"
                    >
                        No fluff. Just the facts.
                    </motion.p>
                    <motion.div
                        variants={slideFromLeft}
                        className="mt-6 h-[2px] w-16 bg-gradient-to-r from-[#39FF14] to-transparent"
                    />
                </motion.div>

                {/* FAQ items — stagger in from right */}
                <motion.div
                    variants={staggerSlow}
                    initial="hidden"
                    animate={inView ? "show" : "hidden"}
                    className="md:w-2/3 space-y-6"
                >
                    {faqs.map((faq, i) => (
                        <FAQItem key={faq.id} faq={faq} index={i} />
                    ))}
                </motion.div>
            </div>
        </section>
    );
}
