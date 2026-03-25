"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { motion } from "framer-motion";

const NAV = [
    { href: "/judge", label: "DASHBOARD", icon: "⬡" },
    { href: "/judge/history", label: "MY_SCORES", icon: "◎" },
];

export default function JudgeNav({ user }: { user: { email: string; firstName: string | null } }) {
    const pathname = usePathname();
    const router = useRouter();

    async function logout() {
        await fetch("/api/auth/logout", { method: "POST" });
        router.push("/auth/login");
    }

    return (
        <nav className="fixed left-0 top-0 h-full w-64 bg-surface-container-lowest border-r border-outline-variant/10 flex flex-col z-40">
            <div className="p-6 border-b border-outline-variant/10">
                <Link href="/" className="text-[#39FF14] font-headline font-black italic text-sm tracking-tighter flicker">FRAMEWORK_2027</Link>
                <div className="font-mono text-[10px] text-on-surface-variant tracking-widest mt-1">JUDGE PORTAL</div>
            </div>
            <div className="flex-1 p-4 space-y-1">
                {NAV.map(item => {
                    const active = pathname === item.href;
                    return (
                        <Link key={item.href} href={item.href}>
                            <motion.div whileHover={{ x: 4 }}
                                className={`flex items-center gap-3 px-4 py-3 font-mono text-xs tracking-widest uppercase transition-colors border-l-2 ${active ? "text-[#39FF14] border-[#39FF14] bg-[#39FF14]/5" : "text-on-surface-variant hover:text-on-surface border-transparent"}`}>
                                <span>{item.icon}</span>{item.label}
                            </motion.div>
                        </Link>
                    );
                })}
            </div>
            <div className="p-4 border-t border-outline-variant/10">
                <div className="font-mono text-xs text-on-surface-variant truncate mb-3">{user.firstName ?? user.email}</div>
                <button onClick={logout} className="w-full font-mono text-xs tracking-widest uppercase text-error border border-error/20 px-4 py-2 text-left">LOGOUT_</button>
            </div>
        </nav>
    );
}
