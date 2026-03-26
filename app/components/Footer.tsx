"use client";

import { useRef } from "react";
import { motion, useInView } from "framer-motion";

const footerLinks = [
    { label: "CONTACT", href: "#contact" },
    { label: "RULES", href: "/rules" },
    { label: "SYSTEM_STATUS", href: "#" },
];

export default function Footer() {
    const ref = useRef(null);
    const inView = useInView(ref, { once: true, margin: "-40px" });

    return (
        <footer ref={ref} className="w-full py-12 px-8 flex flex-col md:flex-row justify-between items-center gap-4 bg-[#0e0e0e] border-t border-[#39FF14]/5 overflow-hidden">
            {/* Left: brand */}
            <motion.div
                initial={{ opacity: 0, x: -30 }}
                animate={inView ? { opacity: 1, x: 0 } : {}}
                transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
                whileHover={{ y: -2 }}
                className="flex flex-col items-center md:items-start gap-2"
            >
                <div className="text-lg font-bold text-[#39FF14] font-headline">
                    FRAMEWORK_2027
                </div>
                <div className="text-[10px] tracking-widest uppercase font-mono text-on-surface-variant/50">
                    ©2027 FRAMEWORK HACKATHON. OPERATED BY LOCAL HIGH SCHOOL SYSTEMS.
                </div>
            </motion.div>

            {/* Right: status + links */}
            <motion.div
                initial={{ opacity: 0, x: 30 }}
                animate={inView ? { opacity: 1, x: 0 } : {}}
                transition={{ duration: 0.7, delay: 0.15, ease: [0.22, 1, 0.36, 1] }}
                className="flex items-center gap-6 flex-wrap justify-center"
            >
                <div className="flex items-center gap-2">
                    <motion.span
                        animate={{ scale: [1, 1.3, 1], opacity: [1, 0.6, 1] }}
                        transition={{ duration: 1.5, repeat: Infinity }}
                        className="w-2 h-2 rounded-full bg-[#39FF14]"
                    />
                    <span className="text-[10px] tracking-widest uppercase font-mono text-[#39FF14]">
                        SYSTEM_STATUS: STABLE
                    </span>
                </div>
                <div className="flex gap-4">
                    {footerLinks.map((link, i) => (
                        <motion.a
                            key={link.label}
                            href={link.href}
                            initial={{ opacity: 0, y: 8 }}
                            animate={inView ? { opacity: 1, y: 0 } : {}}
                            transition={{ delay: 0.3 + i * 0.08, duration: 0.5 }}
                            whileHover={{ y: -3, color: "#39FF14" }}
                            className="text-[10px] tracking-widest uppercase font-mono text-on-surface-variant/50 hover:text-[#39FF14] transition-colors"
                        >
                            {link.label}
                        </motion.a>
                    ))}
                </div>
            </motion.div>
        </footer>
    );
}
