import { getCurrentUser } from "@/app/lib/auth";
import { getEventConfig } from "@/app/lib/event-config";
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

    const [application, membership, eventConfig] = await Promise.all([
        prisma.application.findUnique({ where: { userId: user.id } }),
        prisma.teamMember.findFirst({
            where: { userId: user.id },
            include: { team: { include: { members: { include: { user: true } }, project: true } } },
        }),
        getEventConfig(),
    ]);

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
            <div className="grid grid-cols-1 gap-4 md:grid-cols-4">
                <div className="bg-surface-container-high p-6 border-t-2 border-[#39FF14]">
                    <div className="font-mono text-xs text-on-surface-variant tracking-widest mb-2">THEME</div>
                    <div className="text-sm font-black text-[#39FF14] uppercase tracking-tight">
                        {eventConfig.themeReleased ? "LIVE" : "DAY_OF_REVEAL"}
                    </div>
                    <div className="mt-2 font-mono text-xs text-on-surface-variant">
                        {eventConfig.themeReleased ? eventConfig.themePrompt ?? "Theme released." : "Prompt stays hidden until organizers release it."}
                    </div>
                </div>
                <div className="bg-surface-container-high p-6 border-t-2 border-outline-variant/30">
                    <div className="font-mono text-xs text-on-surface-variant tracking-widest mb-2">PROJECT_FLOW</div>
                    <div className="text-sm font-mono font-bold text-on-surface">
                        {eventConfig.projectSubmissionsOpen ? "OPEN" : "LOCKED"}
                    </div>
                    <div className="font-mono text-xs text-on-surface-variant mt-1">
                        Team creation happens inside project submission.
                    </div>
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
                                GitHub is required and prior coding experience is expected.
                            </p>
                            <div className="font-mono text-xs text-[#39FF14] mt-4 group-hover:translate-x-1 transition-transform">
                                START_APPLICATION →
                            </div>
                        </div>
                    </Link>
                )}

                {application?.status === "ACCEPTED" && (
                    <Link href="/hacker/project">
                        <div className="bg-surface-container-high p-6 border border-outline-variant/20 hover:border-[#39FF14] transition-colors group cursor-pointer">
                            <div className="font-mono text-xs text-on-surface-variant tracking-widest mb-2">NEXT_STEP</div>
                            <h3 className="font-black text-xl uppercase italic tracking-tighter mb-2">
                                {eventConfig.projectSubmissionsOpen ? "Open Project Flow" : "Wait For Day-Of Unlock"}
                            </h3>
                            <p className="font-mono text-xs text-on-surface-variant">
                                {eventConfig.projectSubmissionsOpen
                                    ? membership
                                        ? membership.team.project
                                            ? "Review or update your project submission."
                                            : "Create or join a team inside the project page, then submit."
                                        : "Create or join a team inside the project page."
                                    : "Theme release, team creation, and project submission all open together when organizers unlock them."}
                            </p>
                            <div className="font-mono text-xs text-[#39FF14] mt-4 group-hover:translate-x-1 transition-transform">
                                OPEN_PROJECT_FLOW →
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
