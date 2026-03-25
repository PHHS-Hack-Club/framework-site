"use client";

import { useRef, useState } from "react";
import { motion, useInView, AnimatePresence } from "framer-motion";
import { fadeUp, stagger } from "@/app/lib/animations";


const faqs = [
    {
        id: "01",
        q: "WHO_CAN_PARTICIPATE?",
        a: "All high school students residing in or attending school within Bergen County are eligible. No prior coding experience is required—just the drive to learn.",
    },
    {
        id: "02",
        q: "WHAT_SHOULD_I_BRING?",
        a: "Laptop, chargers, a sleeping bag, toiletries, and any specific hardware components you intend to use. We provide food, power, and high-speed connectivity.",
    },
    {
        id: "03",
        q: "TEAM_LIMITS?",
        a: "Squads of up to 4 operators are permitted. You can form teams prior to the event or find partners during the initialization phase.",
    },
];

function FAQItem({ faq }: { faq: (typeof faqs)[0] }) {
    const [open, setOpen] = useState(false);

    return (
        <motion.div
            variants={fadeUp}
            className="bg-surface-container-high border border-outline-variant/10 overflow-hidden"
        >
            <button
                onClick={() => setOpen((p) => !p)}
                className="w-full text-left p-6 flex items-center justify-between group"
            >
                <div className="font-bold text-lg text-primary-container uppercase flicker">
                    {faq.id} // {faq.q}
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
                        <p className="font-mono text-sm text-on-surface-variant px-6 pb-6">
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
                        Common inquiries regarding the operational parameters of Framework
                        2027.
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
