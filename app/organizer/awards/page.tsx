"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";

type Award = { id: string; name: string; description: string | null; prize: string | null; winners: { project: { id: string; name: string; team: { name: string } } }[] };
type Project = { id: string; name: string; team: { name: string } };

export default function AwardsPage() {
    const [awards, setAwards] = useState<Award[]>([]);
    const [projects, setProjects] = useState<Project[]>([]);
    const [form, setForm] = useState({ name: "", description: "", prize: "" });
    const [saving, setSaving] = useState(false);
    const [err, setErr] = useState<string | null>(null);

    async function load() {
        const [a, p] = await Promise.all([
            fetch("/api/organizer/awards").then(r => r.json()),
            fetch("/api/organizer/projects").then(r => r.json()),
        ]);
        setAwards(a); setProjects(p);
    }
    useEffect(() => { load(); }, []);

    async function createAward() {
        if (!form.name) return;
        setSaving(true); setErr(null);
        const r = await fetch("/api/organizer/awards", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(form) });
        const d = await r.json();
        if (!r.ok) setErr(d.error); else { setForm({ name: "", description: "", prize: "" }); await load(); }
        setSaving(false);
    }

    async function assignWinner(awardId: string, projectId: string) {
        await fetch(`/api/organizer/awards/${awardId}/winner`, { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ projectId }) });
        await load();
    }

    async function removeWinner(awardId: string, projectId: string) {
        await fetch(`/api/organizer/awards/${awardId}/winner/${projectId}`, { method: "DELETE" });
        await load();
    }

    async function deleteAward(id: string) {
        await fetch(`/api/organizer/awards/${id}`, { method: "DELETE" });
        await load();
    }

    const input = "w-full bg-surface border border-outline-variant/30 px-4 py-3 font-mono text-sm text-on-surface focus:outline-none focus:border-[#39FF14] transition-colors";

    return (
        <div className="space-y-8">
            <h1 className="text-4xl font-black italic tracking-tighter uppercase">AWARDS_MATRIX</h1>

            {/* Create */}
            <div className="bg-surface-container-high p-6 border border-outline-variant/10">
                <div className="font-mono text-xs text-[#39FF14] tracking-widest mb-4">DEFINE_AWARD</div>
                {err && <div className="mb-4 p-3 border-l-4 border-error font-mono text-xs text-error">{err}</div>}
                <div className="grid grid-cols-3 gap-4">
                    <div>
                        <label className="font-mono text-xs text-on-surface-variant tracking-widest block mb-2">NAME</label>
                        <input className={input} value={form.name} onChange={e => setForm(p => ({ ...p, name: e.target.value }))} placeholder="Best Overall" />
                    </div>
                    <div>
                        <label className="font-mono text-xs text-on-surface-variant tracking-widest block mb-2">PRIZE</label>
                        <input className={input} value={form.prize} onChange={e => setForm(p => ({ ...p, prize: e.target.value }))} placeholder="$500 Amazon Gift Card" />
                    </div>
                    <div>
                        <label className="font-mono text-xs text-on-surface-variant tracking-widest block mb-2">DESCRIPTION</label>
                        <input className={input} value={form.description} onChange={e => setForm(p => ({ ...p, description: e.target.value }))} placeholder="Optional" />
                    </div>
                </div>
                <motion.button whileTap={{ scale: 0.98 }} onClick={createAward} disabled={saving || !form.name}
                    className="mt-4 px-8 py-3 bg-primary-container text-on-primary font-mono text-xs tracking-widest uppercase font-bold disabled:opacity-50">
                    {saving ? "SAVING..." : "CREATE_AWARD_"}
                </motion.button>
            </div>

            {/* Awards list */}
            <div className="space-y-4">
                {awards.length === 0 && <div className="font-mono text-xs text-on-surface-variant">No awards defined yet.</div>}
                {awards.map(award => (
                    <div key={award.id} className="bg-surface-container-high border border-outline-variant/10">
                        <div className="p-5 flex items-start justify-between">
                            <div>
                                <div className="font-black text-xl uppercase italic tracking-tighter">★ {award.name}</div>
                                {award.prize && <div className="font-mono text-xs text-[#39FF14] mt-0.5">{award.prize}</div>}
                                {award.description && <div className="font-mono text-xs text-on-surface-variant mt-1">{award.description}</div>}
                            </div>
                            <button onClick={() => deleteAward(award.id)} className="font-mono text-xs text-error hover:underline">REMOVE</button>
                        </div>

                        {/* Winner selector */}
                        <div className="px-5 pb-5">
                            <div className="font-mono text-xs text-on-surface-variant tracking-widest mb-3">ASSIGN_WINNER</div>
                            <div className="flex flex-wrap gap-2">
                                {projects.map(p => {
                                    const isWinner = award.winners.some(w => w.project.id === p.id);
                                    return (
                                        <button key={p.id} onClick={() => isWinner ? removeWinner(award.id, p.id) : assignWinner(award.id, p.id)}
                                            className={`font-mono text-xs px-3 py-1.5 border transition-colors ${isWinner ? "border-[#39FF14] text-[#39FF14] bg-[#39FF14]/10" : "border-outline-variant/20 text-on-surface-variant hover:border-outline-variant"}`}>
                                            {isWinner ? "★ " : ""}{p.name}
                                        </button>
                                    );
                                })}
                                {projects.length === 0 && <div className="font-mono text-xs text-on-surface-variant">No projects submitted yet.</div>}
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}
