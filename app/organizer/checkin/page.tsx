"use client";

import { useState, useCallback } from "react";
import { motion } from "framer-motion";

type Hacker = {
    id: string;
    firstName: string | null;
    lastName: string | null;
    email: string;
    application: {
        status: string;
        checkedIn: boolean;
        checkedInAt: string | null;
        school: string;
        grade: string;
        github: string | null;
        experience: string;
        tshirt: string;
        dietary: string | null;
        schoolIdPath: string | null;
    } | null;
};

export default function CheckInPage() {
    const [query, setQuery] = useState("");
    const [results, setResults] = useState<Hacker[]>([]);
    const [loading, setLoading] = useState(false);
    const [toggling, setToggling] = useState<string | null>(null);

    const search = useCallback(async (q: string) => {
        if (!q.trim()) { setResults([]); return; }
        setLoading(true);
        const r = await fetch(`/api/organizer/checkin?q=${encodeURIComponent(q)}`);
        if (r.ok) setResults(await r.json());
        setLoading(false);
    }, []);

    async function toggle(id: string, current: boolean) {
        setToggling(id);
        await fetch(`/api/organizer/checkin/${id}`, { method: "PATCH", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ checkedIn: !current }) });
        setResults(prev => prev.map(h => h.id === id && h.application ? { ...h, application: { ...h.application, checkedIn: !current, checkedInAt: !current ? new Date().toISOString() : null } } : h));
        setToggling(null);
    }

    return (
        <div className="space-y-8 max-w-5xl">
            <h1 className="text-4xl font-black italic tracking-tighter uppercase">DAY_OF_CHECKIN</h1>

            <div className="relative">
                <input
                    className="w-full bg-surface-container-high border border-outline-variant/30 px-6 py-4 font-mono text-sm text-on-surface focus:outline-none focus:border-[#39FF14] transition-colors pr-12"
                    value={query} placeholder="Search by name or email..."
                    onChange={e => { setQuery(e.target.value); search(e.target.value); }}
                />
                {loading && <div className="absolute right-4 top-1/2 -translate-y-1/2 w-3 h-3 border border-[#39FF14] border-t-transparent rounded-full animate-spin" />}
            </div>

            <div className="space-y-2">
                {results.length === 0 && query && !loading && (
                    <div className="font-mono text-xs text-on-surface-variant">NO_RESULTS</div>
                )}
                {results.map(h => (
                    <motion.div
                        key={h.id}
                        layout
                        className={`p-5 border transition-colors ${h.application?.checkedIn ? "bg-[#39FF14]/5 border-[#39FF14]/30" : "bg-surface-container-high border-outline-variant/10"}`}
                    >
                        <div className="flex flex-col gap-5 lg:flex-row lg:items-start lg:justify-between">
                            <div className="min-w-0 flex-1 space-y-4">
                                <div>
                                    <div className="font-bold uppercase tracking-tight">
                                        {h.firstName ?? ""} {h.lastName ?? h.email}
                                    </div>
                                    <div className="font-mono text-xs text-on-surface-variant mt-0.5 break-all">
                                        {h.email}
                                    </div>
                                    {h.application?.checkedIn && h.application.checkedInAt && (
                                        <div className="font-mono text-xs text-[#39FF14] mt-1">
                                            Checked in at {new Date(h.application.checkedInAt).toLocaleTimeString()}
                                        </div>
                                    )}
                                </div>

                                {h.application ? (
                                    <div className="grid gap-5 xl:grid-cols-[minmax(0,1fr)_13rem]">
                                        <div className="grid gap-2 sm:grid-cols-2">
                                            {[
                                                ["Status", h.application.status],
                                                ["School", h.application.school],
                                                ["Grade", h.application.grade],
                                                ["Experience", h.application.experience],
                                                ["T-Shirt", h.application.tshirt],
                                                ["Dietary", h.application.dietary ?? "None"],
                                            ].map(([label, value]) => (
                                                <div key={label} className="min-w-0 border border-outline-variant/15 bg-black/15 px-3 py-2">
                                                    <div className="font-mono text-[10px] tracking-widest uppercase text-on-surface-variant">{label}</div>
                                                    <div className="mt-1 font-mono text-xs break-words">{value}</div>
                                                </div>
                                            ))}
                                        </div>

                                        <div className="space-y-3">
                                            <div className="border border-outline-variant/15 bg-black/15 px-3 py-2">
                                                <div className="font-mono text-[10px] tracking-widest uppercase text-on-surface-variant">GitHub</div>
                                                {h.application.github ? (
                                                    <a
                                                        href={`https://github.com/${h.application.github.replace(/^@/, "").replace(/^https?:\/\/github\.com\//, "").replace(/\/$/, "")}`}
                                                        target="_blank"
                                                        rel="noopener noreferrer"
                                                        className="mt-1 block font-mono text-xs break-all text-[#39FF14] hover:underline"
                                                    >
                                                        {h.application.github}
                                                    </a>
                                                ) : (
                                                    <div className="mt-1 font-mono text-xs text-on-surface-variant">Not provided</div>
                                                )}
                                            </div>

                                            <div className="border border-outline-variant/15 bg-black/15 p-2">
                                                <div className="font-mono text-[10px] tracking-widest uppercase text-on-surface-variant px-1 pb-2">School ID</div>
                                                {h.application.schoolIdPath ? (
                                                    <a
                                                        href={`/api/organizer/school-id/${h.application.schoolIdPath}`}
                                                        target="_blank"
                                                        rel="noopener noreferrer"
                                                        className="block border border-outline-variant/20 overflow-hidden hover:border-[#39FF14]/40 transition-colors group"
                                                    >
                                                        <img
                                                            src={`/api/organizer/school-id/${h.application.schoolIdPath}`}
                                                            alt="School ID"
                                                            className="h-28 w-full object-contain bg-black/30 group-hover:opacity-90 transition-opacity"
                                                        />
                                                        <div className="px-3 py-1.5 font-mono text-[10px] text-on-surface-variant tracking-widest">
                                                            VIEW_ID ↗
                                                        </div>
                                                    </a>
                                                ) : (
                                                    <div className="px-1 py-3 font-mono text-xs text-error">NOT_SUBMITTED</div>
                                                )}
                                            </div>
                                        </div>
                                    </div>
                                ) : (
                                    <div className="font-mono text-xs text-on-surface-variant">NO_APPLICATION</div>
                                )}
                            </div>

                            {h.application ? (
                                <motion.button
                                    whileTap={{ scale: 0.95 }}
                                    onClick={() => toggle(h.id, h.application!.checkedIn)}
                                    disabled={toggling === h.id}
                                    className={`shrink-0 font-mono text-xs tracking-widest uppercase px-6 py-3 border font-bold transition-colors disabled:opacity-50 ${h.application.checkedIn ? "border-error/30 text-error hover:bg-error/10" : "border-[#39FF14]/30 text-[#39FF14] hover:bg-[#39FF14]/10"}`}
                                >
                                    {toggling === h.id ? "..." : h.application.checkedIn ? "UNDO_CHECKIN" : "CHECK_IN_"}
                                </motion.button>
                            ) : (
                                <span className="font-mono text-xs text-on-surface-variant">NO_APPLICATION</span>
                            )}
                        </div>
                    </motion.div>
                ))}
            </div>
        </div>
    );
}
