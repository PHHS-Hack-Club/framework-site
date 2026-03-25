"use client";

import { useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";

type Application = {
    id: string; status: string; school: string; grade: string; experience: string;
    shortAnswer: string; createdAt: string; reviewNote: string | null;
    user: { email: string; firstName: string | null; lastName: string | null };
};

const STATUS_TABS = ["ALL", "PENDING", "ACCEPTED", "WAITLISTED", "REJECTED"] as const;
const STATUS_COLORS: Record<string, string> = {
    PENDING: "text-yellow-400 bg-yellow-400/10 border-yellow-400/30",
    ACCEPTED: "text-[#39FF14] bg-[#39FF14]/10 border-[#39FF14]/30",
    REJECTED: "text-error bg-error/10 border-error/30",
    WAITLISTED: "text-on-surface-variant bg-surface border-outline-variant/20",
};

export default function ApplicationsPage() {
    const [apps, setApps] = useState<Application[]>([]);
    const [filter, setFilter] = useState<typeof STATUS_TABS[number]>("ALL");
    const [selected, setSelected] = useState<Application | null>(null);
    const [note, setNote] = useState("");
    const [loading, setLoading] = useState(true);
    const [acting, setActing] = useState(false);

    const load = useCallback(async () => {
        setLoading(true);
        const res = await fetch("/api/organizer/applications" + (filter !== "ALL" ? `?status=${filter}` : ""));
        if (res.ok) setApps(await res.json());
        setLoading(false);
    }, [filter]);

    useEffect(() => { load(); }, [load]);

    async function updateStatus(id: string, status: string) {
        setActing(true);
        await fetch(`/api/organizer/applications/${id}`, {
            method: "PATCH",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ status, reviewNote: note }),
        });
        setSelected(null); setNote("");
        await load();
        setActing(false);
    }

    const filtered = apps;

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-4xl font-black italic tracking-tighter uppercase">APPLICATIONS</h1>
                    <div className="font-mono text-xs text-on-surface-variant mt-1">{apps.length} RESULTS</div>
                </div>
            </div>

            {/* Filter tabs */}
            <div className="flex gap-2">
                {STATUS_TABS.map(t => (
                    <button key={t} onClick={() => setFilter(t)}
                        className={`font-mono text-xs tracking-widest uppercase px-4 py-2 border transition-colors ${filter === t ? "border-[#39FF14] text-[#39FF14] bg-[#39FF14]/5" : "border-outline-variant/20 text-on-surface-variant hover:border-outline-variant"}`}>
                        {t}
                    </button>
                ))}
            </div>

            <div className="flex gap-6">
                {/* List */}
                <div className="flex-1 space-y-2 min-w-0">
                    {loading ? (
                        <div className="font-mono text-xs text-on-surface-variant animate-pulse">LOADING...</div>
                    ) : filtered.length === 0 ? (
                        <div className="font-mono text-xs text-on-surface-variant">NO_RESULTS</div>
                    ) : filtered.map(app => (
                        <motion.div key={app.id} whileHover={{ x: 2 }} onClick={() => { setSelected(app); setNote(app.reviewNote ?? ""); }}
                            className={`bg-surface-container-high p-5 border cursor-pointer transition-colors ${selected?.id === app.id ? "border-[#39FF14]" : "border-outline-variant/10 hover:border-outline-variant/30"}`}
                        >
                            <div className="flex items-center justify-between">
                                <div>
                                    <div className="font-bold uppercase tracking-tight">
                                        {app.user.firstName ?? ""} {app.user.lastName ?? app.user.email}
                                    </div>
                                    <div className="font-mono text-xs text-on-surface-variant mt-0.5">
                                        {app.school} · {app.grade} · {app.experience}
                                    </div>
                                </div>
                                <span className={`font-mono text-xs border px-2 py-1 ${STATUS_COLORS[app.status]}`}>{app.status}</span>
                            </div>
                        </motion.div>
                    ))}
                </div>

                {/* Detail panel */}
                <AnimatePresence>
                    {selected && (
                        <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: 20 }}
                            className="w-80 shrink-0 bg-surface-container-high border border-outline-variant/20 p-6 space-y-4 sticky top-8 max-h-[calc(100vh-8rem)] overflow-y-auto"
                        >
                            <div>
                                <div className="font-black text-lg uppercase italic tracking-tighter">
                                    {selected.user.firstName ?? ""} {selected.user.lastName ?? ""}
                                </div>
                                <div className="font-mono text-xs text-on-surface-variant">{selected.user.email}</div>
                            </div>

                            <div className="space-y-2">
                                {[["School", selected.school], ["Grade", selected.grade], ["Experience", selected.experience]].map(([k, v]) => (
                                    <div key={k} className="flex justify-between font-mono text-xs">
                                        <span className="text-on-surface-variant">{k}</span>
                                        <span>{v}</span>
                                    </div>
                                ))}
                            </div>

                            <div>
                                <div className="font-mono text-xs text-on-surface-variant mb-2">SHORT_ANSWER</div>
                                <p className="font-mono text-xs leading-relaxed">{selected.shortAnswer}</p>
                            </div>

                            <div>
                                <label className="font-mono text-xs text-on-surface-variant tracking-widest block mb-2">REVIEW_NOTE</label>
                                <textarea value={note} onChange={e => setNote(e.target.value)} rows={3}
                                    className="w-full bg-surface border border-outline-variant/30 px-3 py-2 font-mono text-xs text-on-surface focus:outline-none focus:border-[#39FF14] resize-none" />
                            </div>

                            <div className="space-y-2">
                                {["ACCEPTED", "WAITLISTED", "REJECTED"].map(s => (
                                    <button key={s} disabled={acting || selected.status === s} onClick={() => updateStatus(selected.id, s)}
                                        className={`w-full py-3 font-mono text-xs tracking-widest uppercase border transition-colors disabled:opacity-40 ${s === "ACCEPTED" ? "border-[#39FF14]/30 text-[#39FF14] hover:bg-[#39FF14]/10" :
                                                s === "REJECTED" ? "border-error/30 text-error hover:bg-error/10" :
                                                    "border-outline-variant/30 text-on-surface-variant hover:border-outline-variant"
                                            }`}>
                                        {acting ? "SAVING..." : `MARK_${s}_`}
                                    </button>
                                ))}
                            </div>

                            <button onClick={() => setSelected(null)} className="w-full font-mono text-xs text-on-surface-variant hover:text-on-surface transition-colors">
                                CLOSE
                            </button>
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>
        </div>
    );
}
