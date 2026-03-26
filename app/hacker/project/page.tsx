"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";

type Project = {
    id: string;
    name: string;
    description: string;
    techStack: string;
    repoUrl: string | null;
    demoUrl: string | null;
};

type Member = {
    userId: string;
    user: { firstName: string | null; email: string };
};

type Team = {
    id: string;
    name: string;
    joinCode: string;
    members: Member[];
    project: { name: string } | null;
};

type Application = {
    status: string;
};

type EventConfig = {
    themeReleased: boolean;
    themePrompt: string | null;
    projectSubmissionsOpen: boolean;
};

export default function ProjectPage() {
    const [project, setProject] = useState<Project | null>(null);
    const [team, setTeam] = useState<Team | null>(null);
    const [application, setApplication] = useState<Application | null>(null);
    const [config, setConfig] = useState<EventConfig | null>(null);
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [creating, setCreating] = useState(false);
    const [joining, setJoining] = useState(false);
    const [success, setSuccess] = useState(false);
    const [err, setErr] = useState<string | null>(null);
    const [teamName, setTeamName] = useState("");
    const [joinCode, setJoinCode] = useState("");
    const [form, setForm] = useState({ name: "", description: "", techStack: "", repoUrl: "", demoUrl: "" });

    async function load() {
        setLoading(true);
        setErr(null);

        try {
            const [configResponse, applicationResponse, teamResponse, projectResponse] = await Promise.all([
                fetch("/api/event-config"),
                fetch("/api/hacker/apply"),
                fetch("/api/hacker/team"),
                fetch("/api/hacker/project"),
            ]);

            const nextConfig = configResponse.ok ? await configResponse.json() : null;
            const nextApplication = applicationResponse.ok ? await applicationResponse.json() : null;
            const nextTeam = teamResponse.ok ? await teamResponse.json() : null;
            const nextProject = projectResponse.ok ? await projectResponse.json() : null;

            setConfig(nextConfig);
            setApplication(nextApplication);
            setTeam(nextTeam);
            setProject(nextProject);

            if (nextProject) {
                setForm({
                    name: nextProject.name,
                    description: nextProject.description,
                    techStack: nextProject.techStack,
                    repoUrl: nextProject.repoUrl ?? "",
                    demoUrl: nextProject.demoUrl ?? "",
                });
            }
        } finally {
            setLoading(false);
        }
    }

    useEffect(() => {
        void load();
    }, []);

    function update(k: keyof typeof form) {
        return (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) =>
            setForm((p) => ({ ...p, [k]: e.target.value }));
    }

    async function saveProject() {
        setSaving(true);
        setErr(null);
        setSuccess(false);

        const response = await fetch("/api/hacker/project", {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(form),
        });

        const data = await response.json().catch(() => null);
        if (!response.ok) {
            setErr(data?.error ?? "Unable to save project.");
            setSaving(false);
            return;
        }

        setProject(data);
        setSuccess(true);
        setSaving(false);
    }

    async function createTeam() {
        setCreating(true);
        setErr(null);

        const response = await fetch("/api/hacker/team", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ action: "create", name: teamName }),
        });

        const data = await response.json().catch(() => null);
        if (!response.ok) {
            setErr(data?.error ?? "Unable to create team.");
            setCreating(false);
            return;
        }

        setTeamName("");
        await load();
        setCreating(false);
    }

    async function joinTeam() {
        setJoining(true);
        setErr(null);

        const response = await fetch("/api/hacker/team", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ action: "join", joinCode }),
        });

        const data = await response.json().catch(() => null);
        if (!response.ok) {
            setErr(data?.error ?? "Unable to join team.");
            setJoining(false);
            return;
        }

        setJoinCode("");
        await load();
        setJoining(false);
    }

    async function leaveTeam() {
        setErr(null);
        const response = await fetch("/api/hacker/team", { method: "DELETE" });
        const data = await response.json().catch(() => null);
        if (!response.ok) {
            setErr(data?.error ?? "Unable to leave team.");
            return;
        }

        setProject(null);
        setForm({ name: "", description: "", techStack: "", repoUrl: "", demoUrl: "" });
        await load();
    }

    const input = "w-full bg-surface border border-outline-variant/30 px-4 py-3 font-mono text-sm text-on-surface focus:outline-none focus:border-[#39FF14] transition-colors";
    const label = "font-mono text-xs text-on-surface-variant tracking-widest block mb-2 uppercase";

    if (loading) {
        return <div className="font-mono text-xs text-on-surface-variant animate-pulse">LOADING_PROJECT_FLOW...</div>;
    }

    if (!application) {
        return (
            <div className="max-w-2xl space-y-4">
                <h1 className="text-4xl font-black italic tracking-tighter uppercase">APPLICATION_REQUIRED</h1>
                <p className="font-mono text-sm leading-7 text-on-surface-variant">
                    Submit your hacker application first. Project and team tools only unlock after that.
                </p>
            </div>
        );
    }

    if (application.status !== "ACCEPTED") {
        return (
            <div className="max-w-2xl space-y-4">
                <h1 className="text-4xl font-black italic tracking-tighter uppercase">ACCEPTANCE_REQUIRED</h1>
                <p className="font-mono text-sm leading-7 text-on-surface-variant">
                    This flow is only available to accepted hackers. Current application status: {application.status}.
                </p>
            </div>
        );
    }

    if (!config?.projectSubmissionsOpen) {
        return (
            <div className="max-w-3xl space-y-6">
                <div>
                    <h1 className="text-4xl font-black italic tracking-tighter uppercase">PROJECT_FLOW_LOCKED</h1>
                    <p className="mt-3 font-mono text-sm leading-7 text-on-surface-variant">
                        Team creation and project submissions both open day-of when organizers unlock them.
                    </p>
                </div>

                <div className="border border-[#39FF14]/15 bg-surface-container-high p-6">
                    <div className="font-mono text-xs uppercase tracking-[0.2em] text-[#39FF14]">THEME_STATUS</div>
                    <div className="mt-4 text-2xl font-black uppercase tracking-tight">
                        {config?.themeReleased ? "THEME_LIVE" : "???"}
                    </div>
                    <p className="mt-3 font-mono text-sm leading-7 text-on-surface-variant">
                        {config?.themeReleased && config.themePrompt
                            ? config.themePrompt
                            : "Theme withheld."}
                    </p>
                </div>

                {team && (
                    <div className="border border-outline-variant/20 bg-surface-container-high p-6">
                        <div className="font-mono text-xs uppercase tracking-[0.2em] text-on-surface-variant">CURRENT_TEAM</div>
                        <div className="mt-3 text-xl font-black uppercase italic tracking-tighter">{team.name}</div>
                    </div>
                )}
            </div>
        );
    }

    return (
        <div className="max-w-3xl space-y-8">
            <div>
                <h1 className="text-4xl font-black italic tracking-tighter uppercase">
                    {project ? "EDIT_PROJECT" : "PROJECT_SUBMISSION"}
                </h1>
                <p className="mt-2 font-mono text-xs tracking-widest text-on-surface-variant">
                    TEAM_SETUP_AND_PROJECT_FORM
                </p>
            </div>

            <div className="border border-[#39FF14]/15 bg-surface-container-high p-6">
                <div className="font-mono text-xs uppercase tracking-[0.2em] text-[#39FF14]">DAY_OF_THEME</div>
                <div className="mt-3 text-2xl font-black uppercase tracking-tight">
                    {config?.themeReleased ? "LIVE_PROMPT" : "???"}
                </div>
                <p className="mt-3 font-mono text-sm leading-7 text-on-surface-variant">
                    {config?.themeReleased && config.themePrompt
                        ? config.themePrompt
                        : "Theme withheld."}
                </p>
            </div>

            {err && <div className="p-3 border-l-4 border-error font-mono text-xs text-error">{err}</div>}
            {success && <div className="p-3 border-l-4 border-[#39FF14] font-mono text-xs text-[#39FF14]">PROJECT_SAVED_SUCCESSFULLY</div>}

            {!team ? (
                <div className="grid gap-6 md:grid-cols-2">
                    <div className="bg-surface-container-high p-6 border border-outline-variant/20">
                        <div className="font-mono text-xs text-[#39FF14] tracking-widest mb-4">CREATE_NEW_TEAM</div>
                        <div className="space-y-4">
                            <div>
                                <label className={label}>Team Name</label>
                                <input className={input} value={teamName} onChange={(e) => setTeamName(e.target.value)} placeholder="Team Null Pointer" />
                            </div>
                            <motion.button whileTap={{ scale: 0.98 }} onClick={createTeam} disabled={creating || !teamName} className="w-full py-3 bg-primary-container text-on-primary font-mono text-xs tracking-widest uppercase font-bold disabled:opacity-50">
                                {creating ? "CREATING..." : "CREATE_TEAM_"}
                            </motion.button>
                        </div>
                    </div>

                    <div className="bg-surface-container-high p-6 border border-outline-variant/20">
                        <div className="font-mono text-xs text-on-surface-variant tracking-widest mb-4">JOIN_EXISTING</div>
                        <div className="space-y-4">
                            <div>
                                <label className={label}>Join Code</label>
                                <input className={input} value={joinCode} onChange={(e) => setJoinCode(e.target.value)} placeholder="XXXXXXXX" />
                            </div>
                            <motion.button whileTap={{ scale: 0.98 }} onClick={joinTeam} disabled={joining || !joinCode} className="w-full py-3 border border-outline-variant/30 font-mono text-xs tracking-widest uppercase hover:border-[#39FF14] hover:text-[#39FF14] transition-colors disabled:opacity-50">
                                {joining ? "JOINING..." : "JOIN_TEAM_"}
                            </motion.button>
                        </div>
                    </div>
                </div>
            ) : (
                <div className="space-y-6">
                    <div className="grid gap-4 md:grid-cols-[1.1fr_0.9fr]">
                        <div className="bg-surface-container-high p-6 border-l-4 border-[#39FF14]">
                            <div className="font-mono text-xs text-on-surface-variant tracking-widest mb-2">TEAM</div>
                            <div className="text-2xl font-black italic tracking-tighter uppercase">{team.name}</div>
                            <div className="mt-4 font-mono text-xs text-on-surface-variant tracking-widest">JOIN_CODE</div>
                            <div className="mt-2 font-mono text-2xl font-bold tracking-widest text-[#39FF14]">
                                {team.joinCode.slice(0, 8).toUpperCase()}
                            </div>
                        </div>

                        <div className="bg-surface-container-high p-6 border border-outline-variant/20">
                            <div className="font-mono text-xs text-on-surface-variant tracking-widest mb-4">
                                MEMBERS ({team.members.length}/4)
                            </div>
                            <div className="space-y-3">
                                {team.members.map((member) => (
                                    <div key={member.userId} className="flex items-center gap-3 font-mono text-sm">
                                        <span className="h-2 w-2 rounded-full bg-[#39FF14]" />
                                        {member.user.firstName ?? member.user.email}
                                    </div>
                                ))}
                            </div>
                            <button onClick={leaveTeam} className="mt-5 font-mono text-xs tracking-widest uppercase text-error border border-error/20 px-4 py-2 hover:bg-error/5 transition-colors">
                                LEAVE_TEAM_
                            </button>
                        </div>
                    </div>

                    <div className="space-y-5">
                        <div>
                            <label className={label}>Project Name</label>
                            <input className={input} value={form.name} onChange={update("name")} placeholder="Build name" required />
                        </div>
                        <div>
                            <label className={label}>Description</label>
                            <textarea className={`${input} resize-none`} rows={4} value={form.description} onChange={update("description")} placeholder="What does your project do?" />
                        </div>
                        <div>
                            <label className={label}>Tech Stack</label>
                            <input className={input} value={form.techStack} onChange={update("techStack")} placeholder="Next.js, PostgreSQL, Python..." />
                        </div>
                        <div>
                            <label className={label}>GitHub Repo URL (optional)</label>
                            <input className={input} value={form.repoUrl} onChange={update("repoUrl")} placeholder="https://github.com/..." />
                        </div>
                        <div>
                            <label className={label}>Demo URL (optional)</label>
                            <input className={input} value={form.demoUrl} onChange={update("demoUrl")} placeholder="https://..." />
                        </div>
                    </div>

                    <motion.button whileTap={{ scale: 0.98 }} onClick={saveProject} disabled={saving || !form.name}
                        className="w-full py-4 bg-primary-container text-on-primary font-mono text-xs tracking-widest uppercase font-bold disabled:opacity-50 glow-breathe">
                        {saving ? "SAVING..." : project ? "UPDATE_PROJECT_" : "SUBMIT_PROJECT_"}
                    </motion.button>
                </div>
            )}
        </div>
    );
}
