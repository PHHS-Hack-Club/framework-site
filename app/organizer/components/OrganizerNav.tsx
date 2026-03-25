"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { motion } from "framer-motion";

const NAV = [
    { href: "/organizer", label: "DASHBOARD", icon: "⬡" },
    { href: "/organizer/applications", label: "APPLICATIONS", icon: "◈" },
    { href: "/organizer/email", label: "MASS EMAIL", icon: "◎" },
    { href: "/organizer/schedule", label: "SCHEDULE", icon: "◫" },
    { href: "/organizer/judges", label: "JUDGES", icon: "◉" },
    { href: "/organizer/judging", label: "JUDGING", icon: "▣" },
    { href: "/organizer/awards", label: "AWARDS", icon: "★" },
    { href: "/organizer/checkin", label: "CHECK-IN", icon: "✓" },
    { href: "/organizer/export", label: "EXPORT", icon: "↗" },
];

export default function OrganizerNav({ user }: { user: { email: string; firstName: string | null } }) {
    const pathname = usePathname();
    const router = useRouter();

    async function logout() {
        await fetch("/api/auth/logout", { method: "POST" });
        router.push("/auth/login");
    }

    return (
        <nav className="fixed left-0 top-0 h-full w-64 bg-surface-container-lowest border-r border-outline-variant/10 flex flex-col z-40 overflow-y-auto">
            <div className="p-6 border-b border-outline-variant/10">
                <Link href="/" className="text-[#39FF14] font-headline font-black italic text-sm tracking-tighter flicker">FRAMEWORK_2027</Link>
                <div className="font-mono text-[10px] text-error tracking-widest mt-1">ORGANIZER_PANEL</div>
            </div>

            <div className="flex-1 p-4 space-y-0.5">
                {NAV.map((item) => {
                    const active = pathname === item.href || (item.href !== "/organizer" && pathname.startsWith(item.href));
                    return (
                        <Link key={item.href} href={item.href}>
                            <motion.div whileHover={{ x: 4 }}
                                className={`flex items-center gap-3 px-4 py-2.5 font-mono text-xs tracking-widest uppercase transition-colors ${active ? "text-[#39FF14] border-l-2 border-[#39FF14] bg-[#39FF14]/5" : "text-on-surface-variant hover:text-on-surface border-l-2 border-transparent"}`}
                            >
                                <span>{item.icon}</span>{item.label}
                            </motion.div>
                        </Link>
                    );
                })}
            </div>

            <div className="p-4 border-t border-outline-variant/10">
                <div className="font-mono text-xs text-on-surface-variant truncate mb-3">{user.firstName ?? user.email}</div>
                <button onClick={logout} className="w-full font-mono text-xs tracking-widest uppercase text-error hover:text-on-surface transition-colors text-left px-4 py-2 border border-error/20">LOGOUT_</button>
            </div>
        </nav>
    );
}
