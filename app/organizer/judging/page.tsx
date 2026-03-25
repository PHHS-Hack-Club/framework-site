"use client";

import { useState, useEffect, useCallback } from "react";
import { motion } from "framer-motion";

type Round = { id: string; name: string; status: string; _count: { assignments: number } };
type Project = { id: string; name: string; team: { name: string }; _count: { judgeAssignments: number } };
type Judge = { id: string; email: string; firstName: string | null };

export default function JudgingPage() {
    const [rounds, setRounds] = useState<Round[]>([]);
    const [projects, setProjects] = useState<Project[]>([]);
    const [judges, setJudges] = useState<Judge[]>([]);
    const [newRoundName, setNewRoundName] = useState("");
    const [assigning, setAssigning] = useState(false);
    const [selectedRound, setSelectedRound] = useState<string | null>(null);

    const load = useCallback(async () => {
        const [r, p, j] = await Promise.all([
            fetch("/api/organizer/judging/rounds").then(r => r.json()),
            fetch("/api/organizer/projects").then(r => r.json()),
            fetch("/api/organizer/judges").then(r => r.json()),
        ]);
        setRounds(r); setProjects(p); setJudges(j);
    }, []);

    useEffect(() => { load(); }, [load]);

    async function createRound() {
        if (!newRoundName) return;
        await fetch("/api/organizer/judging/rounds", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ name: newRoundName }) });
        setNewRoundName(""); await load();
    }

    async function toggleRound(id: string, status: string) {
        const newStatus = status === "OPEN" ? "CLOSED" : "OPEN";
        await fetch(`/api/organizer/judging/rounds/${id}`, { method: "PATCH", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ status: newStatus }) });
        await load();
    }

    async function autoAssign(roundId: string) {
        setAssigning(true);
        await fetch(`/api/organizer/judging/assign`, { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ roundId }) });
        await load(); setAssigning(false);
    }

    const input = "bg-surface border border-outline-variant/30 px-4 py-3 font-mono text-sm text-on-surface focus:outline-none focus:border-[#39FF14] transition-colors";

    return (
        <div className="space-y-8">
            <h1 className="text-4xl font-black italic tracking-tighter uppercase">JUDGING_CONTROL</h1>

            {/* Create round */}
            <div className="bg-surface-container-high p-6 border border-outline-variant/10">
                <div className="font-mono text-xs text-[#39FF14] tracking-widest mb-4">CREATE_ROUND</div>
                <div className="flex gap-4">
                    <input className={`${input} flex-1`} value={newRoundName} onChange={e => setNewRoundName(e.target.value)} placeholder="Round 1 — All Projects" />
                    <motion.button whileTap={{ scale: 0.98 }} onClick={createRound} disabled={!newRoundName}
                        className="px-8 py-3 bg-primary-container text-on-primary font-mono text-xs tracking-widest uppercase font-bold disabled:opacity-50">
                        CREATE_
                    </motion.button>
                </div>
            </div>

            {/* Rounds */}
            <div className="space-y-4">
                {rounds.length === 0 && <div className="font-mono text-xs text-on-surface-variant">No rounds created yet.</div>}
                {rounds.map(round => (
                    <div key={round.id} className="bg-surface-container-high border border-outline-variant/10">
                        <div className="p-5 flex items-center justify-between">
                            <div>
                                <div className="font-bold uppercase tracking-tight">{round.name}</div>
                                <div className="font-mono text-xs text-on-surface-variant mt-0.5">{round._count.assignments} assignments</div>
                            </div>
                            <div className="flex items-center gap-3">
                                <span className={`font-mono text-xs border px-2 py-1 ${round.status === "OPEN" ? "text-[#39FF14] border-[#39FF14]/30 bg-[#39FF14]/5 flicker" : round.status === "CLOSED" ? "text-error border-error/30" : "text-on-surface-variant border-outline-variant/20"}`}>
                                    {round.status}
                                </span>
                                <button onClick={() => autoAssign(round.id)} disabled={assigning}
                                    className="font-mono text-xs tracking-widest border border-outline-variant/20 px-4 py-2 hover:border-[#39FF14] hover:text-[#39FF14] transition-colors disabled:opacity-50">
                                    {assigning ? "AUTO_ASSIGNING..." : "AUTO_ASSIGN"}
                                </button>
                                <button onClick={() => toggleRound(round.id, round.status)}
                                    className={`font-mono text-xs tracking-widest border px-4 py-2 transition-colors ${round.status === "OPEN" ? "border-error/30 text-error hover:bg-error/10" : "border-[#39FF14]/30 text-[#39FF14] hover:bg-[#39FF14]/10"}`}>
                                    {round.status === "OPEN" ? "CLOSE_ROUND" : "OPEN_ROUND"}
                                </button>
                                <button onClick={() => setSelectedRound(selectedRound === round.id ? null : round.id)} className="font-mono text-xs text-on-surface-variant hover:text-on-surface transition-colors">
                                    {selectedRound === round.id ? "HIDE" : "DETAILS"}
                                </button>
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            {/* Stats: projects & judges */}
            <div className="grid grid-cols-2 gap-6">
                <div className="bg-surface-container-high p-6 border border-outline-variant/10">
                    <div className="font-mono text-xs text-on-surface-variant tracking-widest mb-4">PROJECTS ({projects.length})</div>
                    <div className="space-y-2 max-h-64 overflow-y-auto">
                        {projects.map(p => (
                            <div key={p.id} className="flex justify-between font-mono text-xs">
                                <span className="truncate">{p.name}</span>
                                <span className="text-on-surface-variant shrink-0 ml-2">{p._count.judgeAssignments} judges</span>
                            </div>
                        ))}
                    </div>
                </div>
                <div className="bg-surface-container-high p-6 border border-outline-variant/10">
                    <div className="font-mono text-xs text-on-surface-variant tracking-widest mb-4">JUDGES ({judges.length})</div>
                    <div className="space-y-2 max-h-64 overflow-y-auto">
                        {judges.map(j => (
                            <div key={j.id} className="font-mono text-xs">{j.firstName ?? j.email}</div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
}
