"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";

const NAV_LINKS = ["about", "schedule", "faq", "contact"];

export default function Navbar() {
    const [scrolled, setScrolled] = useState(false);
    const [menuOpen, setMenuOpen] = useState(false);
    const [activeSection, setActiveSection] = useState("");

    useEffect(() => {
        const handleScroll = () => {
            setScrolled(window.scrollY > 40);
            // Track which section is in view
            for (const id of [...NAV_LINKS].reverse()) {
                const el = document.getElementById(id);
                if (el && window.scrollY >= el.offsetTop - 120) {
                    setActiveSection(id);
                    return;
                }
            }
            setActiveSection("");
        };
        window.addEventListener("scroll", handleScroll, { passive: true });
        return () => window.removeEventListener("scroll", handleScroll);
    }, []);

    const scrollTo = (id: string) => {
        document.getElementById(id)?.scrollIntoView({ behavior: "smooth", block: "start" });
        setMenuOpen(false);
    };

    return (
        <>
            <motion.nav
                initial={{ y: -80, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ duration: 0.6, ease: "easeOut" }}
                className={`fixed top-0 left-0 w-full z-50 transition-all duration-500 ${scrolled
                    ? "bg-[#0e0e0e]/95 backdrop-blur-xl border-b border-[#39FF14]/10 shadow-[0_0_40px_rgba(57,255,20,0.08)]"
                    : "bg-transparent"
                    }`}
            >
                <div className="flex justify-between items-center px-6 md:px-12 py-4">
                    {/* Logo */}
                    <button onClick={() => scrollTo("hero")} className="group flex items-center gap-3">
                        <motion.span
                            animate={{ opacity: [1, 0.4, 1], y: [0, -2, 0] }}
                            transition={{ duration: 2.4, repeat: Infinity, ease: "linear" }}
                            className="text-[#39FF14] font-mono text-xs"
                        >
                            ⬡
                        </motion.span>
                        <motion.span
                            whileHover={{ skewX: -4, x: 2 }}
                            className="text-xl font-black tracking-tighter text-[#39FF14] italic font-headline"
                        >
                            FRAMEWORK_2027
                        </motion.span>
                    </button>

                    {/* Desktop nav */}
                    <div className="hidden md:flex gap-8 items-center">
                        {NAV_LINKS.map((item) => (
                            <motion.button
                                key={item}
                                onClick={() => scrollTo(item)}
                                whileHover={{ y: -2 }}
                                className="relative font-mono text-xs tracking-[0.2em] uppercase text-on-surface-variant hover:text-on-surface transition-colors cursor-pointer group"
                            >
                                {item}
                                <motion.span
                                    animate={{
                                        scaleX: activeSection === item ? 1 : 0,
                                        opacity: activeSection === item ? 1 : 0,
                                    }}
                                    style={{ originX: 0 }}
                                    className="absolute -bottom-1 left-0 w-full h-[1px] bg-[#39FF14]"
                                />
                                <motion.span
                                    whileHover={{ scaleX: 1, opacity: 1 }}
                                    initial={{ scaleX: 0, opacity: 0 }}
                                    style={{ originX: 0 }}
                                    className="absolute -bottom-1 left-0 w-full h-[1px] bg-[#39FF14]/40"
                                />
                            </motion.button>
                        ))}

                        <div className="w-px h-5 bg-[#39FF14]/20" />

                        <Link href="/auth/login">
                            <motion.span
                                whileHover={{ color: "#39FF14" }}
                                className="font-mono text-xs tracking-[0.2em] uppercase text-on-surface-variant cursor-pointer transition-colors"
                            >
                                LOGIN
                            </motion.span>
                        </Link>

                        <Link href="/auth/signup">
                            <motion.div
                                whileHover={{
                                    scale: 1.04,
                                    y: -2,
                                    boxShadow: "0 0 30px rgba(57,255,20,0.5)",
                                }}
                                whileTap={{ scale: 0.96 }}
                                className="panel-sheen bg-[#39FF14] text-[#053900] px-5 py-2 font-mono text-xs font-bold tracking-[0.2em] uppercase cursor-pointer"
                            >
                                APPLY →
                            </motion.div>
                        </Link>
                    </div>

                    {/* Mobile toggle */}
                    <button
                        className="md:hidden font-mono text-[#39FF14] text-lg"
                        onClick={() => setMenuOpen((p) => !p)}
                        aria-label="Toggle menu"
                    >
                        {menuOpen ? "[ ✕ ]" : "[ ≡ ]"}
                    </button>
                </div>
            </motion.nav>

            {/* Mobile menu */}
            <AnimatePresence>
                {menuOpen && (
                    <motion.div
                        key="mobile-menu"
                        initial={{ opacity: 0, y: -16 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -16 }}
                        transition={{ duration: 0.2 }}
                        className="fixed top-[60px] left-0 w-full bg-[#0a0a0a]/98 backdrop-blur-xl z-40 border-t border-b border-[#39FF14]/10 flex flex-col items-start px-8 py-8 gap-5"
                    >
                        {NAV_LINKS.map((item) => (
                            <motion.button
                                key={item}
                                onClick={() => scrollTo(item)}
                                whileHover={{ x: 4 }}
                                className="font-mono tracking-[0.25em] uppercase text-sm text-on-surface-variant hover:text-[#39FF14] transition-colors flex items-center gap-3 group"
                            >
                                <span className="text-[#39FF14]/30 group-hover:text-[#39FF14] transition-colors">›</span>
                                {item}
                            </motion.button>
                        ))}
                        <div className="w-16 h-px bg-[#39FF14]/20 my-1" />
                        <Link href="/auth/signup" onClick={() => setMenuOpen(false)}>
                            <div className="panel-sheen bg-[#39FF14] text-[#053900] px-8 py-3 font-mono text-sm font-bold tracking-widest uppercase">
                                APPLY_NOW →
                            </div>
                        </Link>
                    </motion.div>
                )}
            </AnimatePresence>
        </>
    );
}
