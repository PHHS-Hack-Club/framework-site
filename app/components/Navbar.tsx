"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";

const NAV_LINKS = [
    { label: "ABOUT", id: "about" },
    { label: "FAQ", id: "faq" },
    { label: "CONTACT", id: "contact" },
];
const NAV_PAGE_LINKS = [{ label: "RULES", href: "/rules" }];

export default function Navbar({ dashboardHref }: { dashboardHref: string | null }) {
    const pathname = usePathname();
    const router = useRouter();
    const isHome = pathname === "/";
    const [scrolled, setScrolled] = useState(false);
    const [menuOpen, setMenuOpen] = useState(false);
    const [activeSection, setActiveSection] = useState("");

    useEffect(() => {
        const handleScroll = () => {
            setScrolled(window.scrollY > 40);
            if (!isHome) {
                setActiveSection("");
                return;
            }
            // Track which section is in view
            for (const { id } of [...NAV_LINKS].reverse()) {
                const el = document.getElementById(id);
                if (el && window.scrollY >= el.offsetTop - 120) {
                    setActiveSection(id);
                    return;
                }
            }
            setActiveSection("");
        };
        handleScroll();
        window.addEventListener("scroll", handleScroll, { passive: true });
        return () => window.removeEventListener("scroll", handleScroll);
    }, [isHome]);

    const scrollTo = (id: string) => {
        if (!isHome) {
            router.push(`/#${id}`);
            setMenuOpen(false);
            return;
        }
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
                    {isHome ? (
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
                                className="text-xl font-black tracking-tight text-[#39FF14] italic font-headline"
                            >
                                FRAMEWORK_2027
                            </motion.span>
                        </button>
                    ) : (
                        <Link href="/" className="group flex items-center gap-3">
                            <motion.span
                                animate={{ opacity: [1, 0.4, 1], y: [0, -2, 0] }}
                                transition={{ duration: 2.4, repeat: Infinity, ease: "linear" }}
                                className="text-[#39FF14] font-mono text-xs"
                            >
                                ⬡
                            </motion.span>
                            <motion.span
                                whileHover={{ skewX: -4, x: 2 }}
                                className="text-xl font-black tracking-tight text-[#39FF14] italic font-headline"
                            >
                                FRAMEWORK_2027
                            </motion.span>
                        </Link>
                    )}

                    {/* Desktop nav */}
                    <div className="hidden md:flex gap-8 items-center">
                        {NAV_LINKS.map((item) => (
                            <motion.button
                                key={item.id}
                                onClick={() => scrollTo(item.id)}
                                whileHover={{ y: -2 }}
                                className="relative font-mono text-xs tracking-[0.2em] uppercase text-on-surface-variant hover:text-on-surface transition-colors cursor-pointer group"
                            >
                                {item.label}
                                <motion.span
                                    animate={{
                                        scaleX: activeSection === item.id ? 1 : 0,
                                        opacity: activeSection === item.id ? 1 : 0,
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

                        {NAV_PAGE_LINKS.map((link) => (
                            <Link key={link.label} href={link.href}>
                                <motion.span
                                    whileHover={{ y: -2, color: "#39FF14" }}
                                    className={`font-mono text-xs tracking-[0.2em] uppercase transition-colors cursor-pointer ${pathname === link.href
                                        ? "text-[#39FF14]"
                                        : "text-on-surface-variant hover:text-on-surface"
                                        }`}
                                >
                                    {link.label}
                                </motion.span>
                            </Link>
                        ))}

                        <div className="w-px h-5 bg-[#39FF14]/20" />

                        {dashboardHref ? (
                            <Link href={dashboardHref}>
                                <motion.div
                                    whileHover={{
                                        scale: 1.04,
                                        y: -2,
                                        boxShadow: "0 0 30px rgba(57,255,20,0.5)",
                                    }}
                                    whileTap={{ scale: 0.96 }}
                                    className="panel-sheen bg-[#39FF14] text-[#053900] px-5 py-2 font-mono text-xs font-bold tracking-[0.2em] uppercase cursor-pointer"
                                >
                                    OPEN_DASHBOARD →
                                </motion.div>
                            </Link>
                        ) : (
                            <>
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
                            </>
                        )}
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
                                key={item.id}
                                onClick={() => scrollTo(item.id)}
                                whileHover={{ x: 4 }}
                                className="font-mono tracking-[0.25em] uppercase text-sm text-on-surface-variant hover:text-[#39FF14] transition-colors flex items-center gap-3 group"
                            >
                                <span className="text-[#39FF14]/30 group-hover:text-[#39FF14] transition-colors">›</span>
                                {item.label}
                            </motion.button>
                        ))}
                        {NAV_PAGE_LINKS.map((link) => (
                            <Link key={link.label} href={link.href} onClick={() => setMenuOpen(false)}>
                                <motion.div
                                    whileHover={{ x: 4 }}
                                    className={`font-mono tracking-[0.25em] uppercase text-sm transition-colors flex items-center gap-3 group ${pathname === link.href
                                        ? "text-[#39FF14]"
                                        : "text-on-surface-variant hover:text-[#39FF14]"
                                        }`}
                                >
                                    <span className="text-[#39FF14]/30 group-hover:text-[#39FF14] transition-colors">›</span>
                                    {link.label}
                                </motion.div>
                            </Link>
                        ))}
                        <div className="w-16 h-px bg-[#39FF14]/20 my-1" />
                        <Link href={dashboardHref ?? "/auth/signup"} onClick={() => setMenuOpen(false)}>
                            <div className="panel-sheen bg-[#39FF14] text-[#053900] px-8 py-3 font-mono text-sm font-bold tracking-widest uppercase">
                                {dashboardHref ? "OPEN_DASHBOARD →" : "APPLY_NOW →"}
                            </div>
                        </Link>
                    </motion.div>
                )}
            </AnimatePresence>
        </>
    );
}
