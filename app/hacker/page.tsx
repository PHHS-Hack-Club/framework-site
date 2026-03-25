import { getCurrentUser } from "@/app/lib/auth";
import { prisma } from "@/app/lib/prisma";
import { redirect } from "next/navigation";
import Link from "next/link";

const STATUS_COLORS: Record<string, string> = {
    PENDING: "text-yellow-400 border-yellow-400/30 bg-yellow-400/5",
    ACCEPTED: "text-[#39FF14] border-[#39FF14]/30 bg-[#39FF14]/5",
    REJECTED: "text-error border-error/30 bg-error/5",
    WAITLISTED: "text-on-surface-variant border-outline-variant/30 bg-surface",
};

export default async function HackerDashboard() {
    const user = await getCurrentUser();
    if (!user) redirect("/auth/login");

    const [application, membership, totalAccepted] = await Promise.all([
        prisma.application.findUnique({ where: { userId: user.id } }),
        prisma.teamMember.findFirst({
            where: { userId: user.id },
            include: { team: { include: { members: { include: { user: true } }, project: true } } },
        }),
        prisma.application.count({ where: { status: "ACCEPTED" } }),
    ]);

    const slotsLeft = 64 - totalAccepted;

    return (
        <div className="space-y-8">
            {/* Header */}
            <div>
                <h1 className="text-4xl font-black italic tracking-tighter uppercase">
                    WELCOME, {user.firstName?.toUpperCase() ?? "HACKER"}
                </h1>
                <div className="font-mono text-xs text-on-surface-variant tracking-widest mt-1">
                    OPERATOR_ID: {user.id.slice(0, 8).toUpperCase()}
                </div>
            </div>

            {/* Stats row */}
            <div className="grid grid-cols-3 gap-4">
                <div className="bg-surface-container-high p-6 border-t-2 border-[#39FF14]">
                    <div className="font-mono text-xs text-on-surface-variant tracking-widest mb-2">SLOTS_REMAINING</div>
                    <div className="text-4xl font-black text-[#39FF14] flicker">{slotsLeft}</div>
                    <div className="font-mono text-xs text-on-surface-variant">/ 64 TOTAL</div>
                </div>
                <div className="bg-surface-container-high p-6 border-t-2 border-outline-variant/30">
                    <div className="font-mono text-xs text-on-surface-variant tracking-widest mb-2">APPLICATION</div>
                    <div className={`text-sm font-mono font-bold px-3 py-1 border inline-block ${application ? STATUS_COLORS[application.status] : "text-on-surface-variant border-outline-variant/20"}`}>
                        {application?.status ?? "NOT_SUBMITTED"}
                    </div>
                </div>
                <div className="bg-surface-container-high p-6 border-t-2 border-outline-variant/30">
                    <div className="font-mono text-xs text-on-surface-variant tracking-widest mb-2">TEAM</div>
                    <div className="text-sm font-mono font-bold text-on-surface">
                        {membership?.team.name ?? "NO_TEAM"}
                    </div>
                    {membership && (
                        <div className="font-mono text-xs text-on-surface-variant mt-1">
                            {membership.team.members.length} / 4 MEMBERS
                        </div>
                    )}
                </div>
            </div>

            {/* Action cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {!application && (
                    <Link href="/hacker/apply">
                        <div className="bg-surface-container-high p-6 border border-[#39FF14]/20 hover:border-[#39FF14] transition-colors group cursor-pointer">
                            <div className="text-[#39FF14] font-mono text-xs tracking-widest mb-2">ACTION_REQUIRED</div>
                            <h3 className="font-black text-xl uppercase italic tracking-tighter mb-2">
                                Submit Application
                            </h3>
                            <p className="font-mono text-xs text-on-surface-variant">
                                {slotsLeft} slots remaining. Apply before they fill up.
                            </p>
                            <div className="font-mono text-xs text-[#39FF14] mt-4 group-hover:translate-x-1 transition-transform">
                                START_APPLICATION →
                            </div>
                        </div>
                    </Link>
                )}

                {application?.status === "ACCEPTED" && !membership && (
                    <Link href="/hacker/team">
                        <div className="bg-surface-container-high p-6 border border-outline-variant/20 hover:border-[#39FF14] transition-colors group cursor-pointer">
                            <div className="font-mono text-xs text-on-surface-variant tracking-widest mb-2">NEXT_STEP</div>
                            <h3 className="font-black text-xl uppercase italic tracking-tighter mb-2">Form Your Team</h3>
                            <p className="font-mono text-xs text-on-surface-variant">Create or join a team of up to 4 hackers.</p>
                            <div className="font-mono text-xs text-[#39FF14] mt-4 group-hover:translate-x-1 transition-transform">
                                MANAGE_TEAM →
                            </div>
                        </div>
                    </Link>
                )}

                {membership && !membership.team.project && (
                    <Link href="/hacker/project">
                        <div className="bg-surface-container-high p-6 border border-outline-variant/20 hover:border-[#39FF14] transition-colors group cursor-pointer">
                            <div className="font-mono text-xs text-on-surface-variant tracking-widest mb-2">NEXT_STEP</div>
                            <h3 className="font-black text-xl uppercase italic tracking-tighter mb-2">Submit Project</h3>
                            <p className="font-mono text-xs text-on-surface-variant">Add your project details before the deadline.</p>
                            <div className="font-mono text-xs text-[#39FF14] mt-4 group-hover:translate-x-1 transition-transform">
                                SUBMIT_PROJECT →
                            </div>
                        </div>
                    </Link>
                )}

                {membership?.team.project && (
                    <div className="bg-surface-container-high p-6 border border-[#39FF14]/30">
                        <div className="text-[#39FF14] font-mono text-xs tracking-widest mb-2">PROJECT_SUBMITTED</div>
                        <h3 className="font-black text-xl uppercase italic tracking-tighter">{membership.team.project.name}</h3>
                        <Link href="/hacker/project" className="font-mono text-xs text-on-surface-variant hover:text-[#39FF14] mt-4 block transition-colors">
                            EDIT_PROJECT →
                        </Link>
                    </div>
                )}
            </div>
        </div>
    );
}
