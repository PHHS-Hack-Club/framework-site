"use client";

import { motion } from "framer-motion";

const footerLinks = [
    { label: "CONTACT", href: "#contact" },
    { label: "DATA_PRIVACY", href: "#" },
    { label: "SYSTEM_STATUS", href: "#" },
];

export default function Footer() {
    return (
        <footer className="w-full py-12 px-8 flex flex-col md:flex-row justify-between items-center gap-4 bg-[#0e0e0e] border-t border-[#39FF14]/5">
            {/* Left: brand */}
            <motion.div whileHover={{ y: -2 }} className="flex flex-col items-center md:items-start gap-2">
                <div className="text-lg font-bold text-[#39FF14] font-headline flicker">
                    FRAMEWORK_2027
                </div>
                <div className="text-[10px] tracking-widest uppercase font-mono text-on-surface-variant/50">
                    ©2027 FRAMEWORK HACKATHON. OPERATED BY LOCAL HIGH SCHOOL SYSTEMS.
                </div>
            </motion.div>

            {/* Right: status + links */}
            <div className="flex items-center gap-6 flex-wrap justify-center">
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
                    {footerLinks.map((link) => (
                        <motion.a
                            key={link.label}
                            href={link.href}
                            whileHover={{ y: -2 }}
                            className="text-[10px] tracking-widest uppercase font-mono text-on-surface-variant/50 hover:text-[#39FF14] transition-colors"
                        >
                            {link.label}
                        </motion.a>
                    ))}
                </div>
            </div>
        </footer>
    );
}
