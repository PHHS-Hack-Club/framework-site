"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";

type Judge = { id: string; email: string; firstName: string | null; lastName: string | null; _count: { judgeAssignments: number; scores: number } };

export default function JudgesPage() {
    const [judges, setJudges] = useState<Judge[]>([]);
    const [email, setEmail] = useState("");
    const [firstName, setFirstName] = useState("");
    const [lastName, setLastName] = useState("");
    const [adding, setAdding] = useState(false);
    const [err, setErr] = useState<string | null>(null);
    const [loading, setLoading] = useState(true);

    async function load() {
        const r = await fetch("/api/organizer/judges");
        if (r.ok) setJudges(await r.json());
        setLoading(false);
    }
    useEffect(() => { load(); }, []);

    async function addJudge() {
        setErr(null); setAdding(true);
        const r = await fetch("/api/organizer/judges", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ email, firstName, lastName }),
        });
        const d = await r.json();
        if (!r.ok) setErr(d.error); else { setEmail(""); setFirstName(""); setLastName(""); await load(); }
        setAdding(false);
    }

    async function removeJudge(id: string) {
        await fetch(`/api/organizer/judges/${id}`, { method: "DELETE" });
        await load();
    }

    const input = "w-full bg-surface border border-outline-variant/30 px-4 py-3 font-mono text-sm text-on-surface focus:outline-none focus:border-[#39FF14] transition-colors";

    return (
        <div className="space-y-8">
            <h1 className="text-4xl font-black italic tracking-tighter uppercase">JUDGE_MANAGEMENT</h1>

            {/* Add form */}
            <div className="bg-surface-container-high p-6 border border-outline-variant/10">
                <div className="font-mono text-xs text-[#39FF14] tracking-widest mb-4">ADD_JUDGE</div>
                {err && <div className="mb-4 p-3 border-l-4 border-error font-mono text-xs text-error">{err}</div>}
                <div className="grid grid-cols-3 gap-4">
                    <div>
                        <label className="font-mono text-xs text-on-surface-variant tracking-widest block mb-2">FIRST NAME</label>
                        <input className={input} value={firstName} onChange={e => setFirstName(e.target.value)} placeholder="Jane" />
                    </div>
                    <div>
                        <label className="font-mono text-xs text-on-surface-variant tracking-widest block mb-2">LAST NAME</label>
                        <input className={input} value={lastName} onChange={e => setLastName(e.target.value)} placeholder="Smith" />
                    </div>
                    <div>
                        <label className="font-mono text-xs text-on-surface-variant tracking-widest block mb-2">EMAIL</label>
                        <input type="email" className={input} value={email} onChange={e => setEmail(e.target.value)} placeholder="judge@example.com" />
                    </div>
                </div>
                <motion.button whileTap={{ scale: 0.98 }} onClick={addJudge} disabled={adding || !email}
                    className="mt-4 px-8 py-3 bg-primary-container text-on-primary font-mono text-xs tracking-widest uppercase font-bold disabled:opacity-50">
                    {adding ? "ADDING..." : "ADD_JUDGE_"}
                </motion.button>
                <p className="font-mono text-xs text-on-surface-variant mt-3">A welcome email with a password setup link will be sent to the judge. The link expires in 7 days.</p>
            </div>

            {/* Judge list */}
            {loading ? <div className="font-mono text-xs text-on-surface-variant animate-pulse">LOADING...</div> : (
                <div className="space-y-2">
                    {judges.length === 0 ? (
                        <div className="font-mono text-xs text-on-surface-variant">No judges added yet.</div>
                    ) : judges.map(j => (
                        <div key={j.id} className="bg-surface-container-high p-5 border border-outline-variant/10 flex items-center justify-between group">
                            <div>
                                <div className="font-bold uppercase tracking-tight">{j.firstName ?? ""} {j.lastName ?? ""}</div>
                                <div className="font-mono text-xs text-on-surface-variant mt-0.5">{j.email}</div>
                            </div>
                            <div className="flex items-center gap-6">
                                <div className="text-right font-mono text-xs text-on-surface-variant">
                                    <div>{j._count.judgeAssignments} assignments</div>
                                    <div>{j._count.scores} scores submitted</div>
                                </div>
                                <button onClick={() => removeJudge(j.id)} className="font-mono text-xs text-error opacity-0 group-hover:opacity-100 transition-opacity hover:underline">
                                    REMOVE
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}
