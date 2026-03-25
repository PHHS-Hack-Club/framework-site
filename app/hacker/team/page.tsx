"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";

type Member = { userId: string; user: { firstName: string | null; email: string } };
type Team = { id: string; name: string; joinCode: string; members: Member[]; project: { name: string } | null };

export default function TeamPage() {
    const [team, setTeam] = useState<Team | null>(null);
    const [loading, setLoading] = useState(true);
    const [creating, setCreating] = useState(false);
    const [joining, setJoining] = useState(false);
    const [teamName, setTeamName] = useState("");
    const [joinCode, setJoinCode] = useState("");
    const [err, setErr] = useState<string | null>(null);

    async function load() {
        setLoading(true);
        const res = await fetch("/api/hacker/team");
        if (res.ok) setTeam(await res.json());
        setLoading(false);
    }

    useEffect(() => { load(); }, []);

    async function createTeam() {
        setErr(null); setCreating(true);
        const res = await fetch("/api/hacker/team", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ action: "create", name: teamName }),
        });
        const data = await res.json();
        if (!res.ok) setErr(data.error); else await load();
        setCreating(false);
    }

    async function joinTeam() {
        setErr(null); setJoining(true);
        const res = await fetch("/api/hacker/team", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ action: "join", joinCode }),
        });
        const data = await res.json();
        if (!res.ok) setErr(data.error); else await load();
        setJoining(false);
    }

    async function leaveTeam() {
        const res = await fetch("/api/hacker/team", { method: "DELETE" });
        if (res.ok) { setTeam(null); }
    }

    const input = "w-full bg-surface border border-outline-variant/30 px-4 py-3 font-mono text-sm text-on-surface focus:outline-none focus:border-[#39FF14] transition-colors";
    const label = "font-mono text-xs text-on-surface-variant tracking-widest block mb-2 uppercase";

    if (loading) return <div className="font-mono text-xs text-on-surface-variant animate-pulse">LOADING_TEAM_DATA...</div>;

    if (team) {
        return (
            <div className="max-w-2xl space-y-8">
                <div>
                    <h1 className="text-4xl font-black italic tracking-tighter uppercase mb-1">{team.name}</h1>
                    <div className="font-mono text-xs text-on-surface-variant tracking-widest">TEAM_ID: {team.id.slice(0, 8).toUpperCase()}</div>
                </div>

                {/* Join code */}
                <div className="bg-surface-container-high p-6 border-l-4 border-[#39FF14]">
                    <div className="font-mono text-xs text-on-surface-variant tracking-widest mb-2">JOIN_CODE</div>
                    <div className="font-mono text-2xl font-bold text-[#39FF14] tracking-widest">{team.joinCode.slice(0, 8).toUpperCase()}</div>
                    <div className="font-mono text-xs text-on-surface-variant mt-1">Share with teammates to join your team</div>
                </div>

                {/* Members */}
                <div className="bg-surface-container-high p-6">
                    <div className="font-mono text-xs text-on-surface-variant tracking-widest mb-4">MEMBERS ({team.members.length}/4)</div>
                    <div className="space-y-3">
                        {team.members.map((m) => (
                            <div key={m.userId} className="flex items-center gap-3 font-mono text-sm">
                                <span className="w-2 h-2 rounded-full bg-[#39FF14]" />
                                {m.user.firstName ?? m.user.email}
                            </div>
                        ))}
                    </div>
                </div>

                <button onClick={leaveTeam} className="font-mono text-xs tracking-widest uppercase text-error border border-error/20 px-6 py-3 hover:bg-error/5 transition-colors">
                    LEAVE_TEAM_
                </button>
            </div>
        );
    }

    return (
        <div className="max-w-2xl space-y-8">
            <h1 className="text-4xl font-black italic tracking-tighter uppercase">TEAM_SETUP</h1>
            {err && <div className="p-3 border-l-4 border-error font-mono text-xs text-error">{err}</div>}

            <div className="grid grid-cols-2 gap-6">
                {/* Create */}
                <div className="bg-surface-container-high p-6 border border-outline-variant/20">
                    <div className="font-mono text-xs text-[#39FF14] tracking-widest mb-4">CREATE_NEW_TEAM</div>
                    <div className="space-y-4">
                        <div>
                            <label className={label}>Team Name</label>
                            <input className={input} value={teamName} onChange={e => setTeamName(e.target.value)} placeholder="Team Null Pointer" />
                        </div>
                        <motion.button whileTap={{ scale: 0.98 }} onClick={createTeam} disabled={creating || !teamName} className="w-full py-3 bg-primary-container text-on-primary font-mono text-xs tracking-widest uppercase font-bold disabled:opacity-50">
                            {creating ? "CREATING..." : "CREATE_"}
                        </motion.button>
                    </div>
                </div>

                {/* Join */}
                <div className="bg-surface-container-high p-6 border border-outline-variant/20">
                    <div className="font-mono text-xs text-on-surface-variant tracking-widest mb-4">JOIN_EXISTING</div>
                    <div className="space-y-4">
                        <div>
                            <label className={label}>Join Code</label>
                            <input className={input} value={joinCode} onChange={e => setJoinCode(e.target.value)} placeholder="XXXXXXXX" />
                        </div>
                        <motion.button whileTap={{ scale: 0.98 }} onClick={joinTeam} disabled={joining || !joinCode} className="w-full py-3 border border-outline-variant/30 font-mono text-xs tracking-widest uppercase hover:border-[#39FF14] hover:text-[#39FF14] transition-colors disabled:opacity-50">
                            {joining ? "JOINING..." : "JOIN_"}
                        </motion.button>
                    </div>
                </div>
            </div>
        </div>
    );
}
