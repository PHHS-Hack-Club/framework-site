import { getCurrentUser } from "@/app/lib/auth";
import { prisma } from "@/app/lib/prisma";
import { redirect } from "next/navigation";

export default async function HackerProfilePage() {
    const user = await getCurrentUser();
    if (!user) redirect("/auth/login");

    const [application, membership] = await Promise.all([
        prisma.application.findUnique({ where: { userId: user.id } }),
        prisma.teamMember.findFirst({
            where: { userId: user.id },
            include: { team: { include: { project: true, members: true } } },
        }),
    ]);

    return (
        <div className="space-y-8">
            <div>
                <h1 className="text-4xl font-black italic tracking-tighter uppercase">PROFILE</h1>
                <p className="mt-2 font-mono text-xs uppercase tracking-[0.18em] text-on-surface-variant">
                    Account + application snapshot
                </p>
            </div>

            <div className="grid gap-4 md:grid-cols-2">
                <div className="border border-outline-variant/20 bg-surface-container-high p-6">
                    <div className="mb-4 font-mono text-xs uppercase tracking-[0.18em] text-[#39FF14]">ACCOUNT</div>
                    <div className="space-y-3 font-mono text-sm">
                        <div>
                            <div className="text-on-surface-variant">Name</div>
                            <div>{[user.firstName, user.lastName].filter(Boolean).join(" ") || "Not set"}</div>
                        </div>
                        <div>
                            <div className="text-on-surface-variant">Email</div>
                            <div>{user.email}</div>
                        </div>
                        <div>
                            <div className="text-on-surface-variant">Role</div>
                            <div>{user.role}</div>
                        </div>
                    </div>
                </div>

                <div className="border border-outline-variant/20 bg-surface-container-high p-6">
                    <div className="mb-4 font-mono text-xs uppercase tracking-[0.18em] text-[#39FF14]">APPLICATION</div>
                    <div className="space-y-3 font-mono text-sm">
                        <div>
                            <div className="text-on-surface-variant">Status</div>
                            <div>{application?.status ?? "NOT_SUBMITTED"}</div>
                        </div>
                        <div>
                            <div className="text-on-surface-variant">GitHub</div>
                            <div>{application?.github ?? "Not submitted yet"}</div>
                        </div>
                        <div>
                            <div className="text-on-surface-variant">Experience</div>
                            <div>{application?.experience ?? "Not submitted yet"}</div>
                        </div>
                    </div>
                </div>
            </div>

            <div className="grid gap-4 md:grid-cols-2">
                <div className="border border-outline-variant/20 bg-surface-container-high p-6">
                    <div className="mb-4 font-mono text-xs uppercase tracking-[0.18em] text-[#39FF14]">TEAM</div>
                    <div className="font-mono text-sm">
                        {membership?.team.name ?? "No team yet"}
                    </div>
                    {membership && (
                        <div className="mt-2 font-mono text-xs text-on-surface-variant">
                            {membership.team.members.length} / 4 members
                        </div>
                    )}
                </div>

                <div className="border border-outline-variant/20 bg-surface-container-high p-6">
                    <div className="mb-4 font-mono text-xs uppercase tracking-[0.18em] text-[#39FF14]">PROJECT</div>
                    <div className="font-mono text-sm">
                        {membership?.team.project?.name ?? "No project submitted yet"}
                    </div>
                </div>
            </div>
        </div>
    );
}
