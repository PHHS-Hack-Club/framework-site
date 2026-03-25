import { prisma } from "@/app/lib/prisma";
import Link from "next/link";

export default async function OrganizerDashboard() {
    const [total, accepted, pending, waitlisted, rejected, checkedIn, teams, projects, judges] = await Promise.all([
        prisma.application.count(),
        prisma.application.count({ where: { status: "ACCEPTED" } }),
        prisma.application.count({ where: { status: "PENDING" } }),
        prisma.application.count({ where: { status: "WAITLISTED" } }),
        prisma.application.count({ where: { status: "REJECTED" } }),
        prisma.application.count({ where: { checkedIn: true } }),
        prisma.team.count(),
        prisma.project.count(),
        prisma.user.count({ where: { role: "JUDGE" } }),
    ]);

    const stats = [
        { label: "TOTAL_APPS", value: total, color: "border-on-surface-variant" },
        { label: "ACCEPTED", value: accepted, color: "border-[#39FF14]", accent: true },
        { label: "PENDING", value: pending, color: "border-yellow-400" },
        { label: "WAITLISTED", value: waitlisted, color: "border-on-surface-variant" },
        { label: "REJECTED", value: rejected, color: "border-error" },
        { label: "CHECKED_IN", value: checkedIn, color: "border-[#39FF14]" },
        { label: "TEAMS", value: teams, color: "border-on-surface-variant" },
        { label: "PROJECTS", value: projects, color: "border-on-surface-variant" },
        { label: "JUDGES", value: judges, color: "border-on-surface-variant" },
    ];

    const actions = [
        { href: "/organizer/applications", label: "Review Applications", sub: `${pending} pending`, urgent: pending > 0 },
        { href: "/organizer/checkin", label: "Day-of Check-in", sub: `${checkedIn}/${accepted} checked in`, urgent: false },
        { href: "/organizer/judging", label: "Manage Judging", sub: "Create & open rounds", urgent: false },
        { href: "/organizer/export", label: "Export PPTX", sub: "Ceremony deck", urgent: false },
    ];

    return (
        <div className="space-y-8">
            <div>
                <h1 className="text-4xl font-black italic tracking-tighter uppercase mb-1">COMMAND_CENTER</h1>
                <div className="font-mono text-xs text-on-surface-variant tracking-widest">
                    {accepted} / 64 SLOTS FILLED — {Math.round((accepted / 64) * 100)}%
                </div>
                {/* Slot bar */}
                <div className="mt-3 h-1 bg-surface-container-high w-full max-w-md">
                    <div className="h-1 bg-[#39FF14] glow-breathe transition-all" style={{ width: `${(accepted / 64) * 100}%` }} />
                </div>
            </div>

            {/* Stats grid */}
            <div className="grid grid-cols-3 md:grid-cols-5 gap-4">
                {stats.map((s) => (
                    <div key={s.label} className={`bg-surface-container-high p-5 border-t-2 ${s.color}`}>
                        <div className="font-mono text-xs text-on-surface-variant tracking-widest mb-2 leading-tight">{s.label}</div>
                        <div className={`text-3xl font-black ${s.accent ? "text-[#39FF14] flicker" : "text-on-surface"}`}>{s.value}</div>
                    </div>
                ))}
            </div>

            {/* Quick actions */}
            <div>
                <div className="font-mono text-xs text-on-surface-variant tracking-widest mb-4">QUICK_ACTIONS</div>
                <div className="grid grid-cols-2 gap-4">
                    {actions.map((a) => (
                        <Link key={a.href} href={a.href}>
                            <div className={`bg-surface-container-high p-6 border group hover:border-[#39FF14] transition-colors cursor-pointer ${a.urgent ? "border-yellow-400/40" : "border-outline-variant/10"}`}>
                                {a.urgent && <div className="font-mono text-xs text-yellow-400 tracking-widest mb-2 flicker">ACTION_REQUIRED</div>}
                                <h3 className="font-black uppercase italic tracking-tighter mb-1">{a.label}</h3>
                                <div className="font-mono text-xs text-on-surface-variant">{a.sub}</div>
                                <div className="font-mono text-xs text-[#39FF14] mt-3 opacity-0 group-hover:opacity-100 transition-opacity">→</div>
                            </div>
                        </Link>
                    ))}
                </div>
            </div>
        </div>
    );
}
