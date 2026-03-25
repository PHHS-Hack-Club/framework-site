"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";

type Assignment = {
    id: string;
    project: { id: string; name: string; description: string; techStack: string };
    score: { submittedAt: string } | null;
    round: { name: string; status: string };
};

export default function JudgeDashboard() {
    const [assignments, setAssignments] = useState<Assignment[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetch("/api/judge/assignments").then(r => r.json()).then(d => { setAssignments(d); setLoading(false); });
    }, []);

    const open = assignments.filter(a => a.round.status === "OPEN");
    const scored = open.filter(a => a.score);
    const pending = open.filter(a => !a.score);

    if (loading) return <div className="font-mono text-xs text-on-surface-variant animate-pulse">LOADING_ASSIGNMENTS...</div>;

    return (
        <div className="space-y-8">
            <div>
                <h1 className="text-4xl font-black italic tracking-tighter uppercase">JUDGE_PANEL</h1>
                <div className="font-mono text-xs text-on-surface-variant mt-1">{scored.length}/{open.length} SCORED IN CURRENT ROUND</div>
            </div>

            {/* Progress */}
            {open.length > 0 && (
                <div className="bg-surface-container-high p-6 border-l-4 border-[#39FF14]">
                    <div className="flex justify-between font-mono text-xs mb-2">
                        <span className="text-on-surface-variant">SCORING_PROGRESS</span>
                        <span className="text-[#39FF14]">{Math.round((scored.length / open.length) * 100)}%</span>
                    </div>
                    <div className="h-1 bg-surface w-full">
                        <div className="h-1 bg-[#39FF14] transition-all" style={{ width: `${(scored.length / open.length) * 100}%` }} />
                    </div>
                </div>
            )}

            {/* Pending */}
            {pending.length > 0 && (
                <div>
                    <div className="font-mono text-xs text-yellow-400 tracking-widest mb-4 flicker">PENDING_SCORES ({pending.length})</div>
                    <div className="space-y-3">
                        {pending.map(a => (
                            <Link key={a.id} href={`/judge/score/${a.id}`}>
                                <motion.div whileHover={{ x: 4 }} className="bg-surface-container-high p-5 border border-outline-variant/10 hover:border-[#39FF14] transition-colors cursor-pointer group">
                                    <div className="flex items-center justify-between">
                                        <div>
                                            <div className="font-bold uppercase tracking-tight">[REDACTED]</div>
                                            <div className="font-mono text-xs text-on-surface-variant mt-1">ASSIGNMENT_ID: {a.id.slice(0, 8).toUpperCase()}</div>
                                        </div>
                                        <div className="font-mono text-xs text-[#39FF14] group-hover:translate-x-1 transition-transform">SCORE →</div>
                                    </div>
                                </motion.div>
                            </Link>
                        ))}
                    </div>
                </div>
            )}

            {/* Scored */}
            {scored.length > 0 && (
                <div>
                    <div className="font-mono text-xs text-[#39FF14] tracking-widest mb-4">COMPLETED ({scored.length})</div>
                    <div className="space-y-2">
                        {scored.map(a => (
                            <div key={a.id} className="bg-surface-container-high p-4 border border-[#39FF14]/20 flex items-center justify-between">
                                <div className="font-mono text-xs text-on-surface-variant">ASSIGNMENT_ID: {a.id.slice(0, 8).toUpperCase()}</div>
                                <div className="font-mono text-xs text-[#39FF14]">✓ SCORED</div>
                            </div>
                        ))}
                    </div>
                </div>
            )}

            {open.length === 0 && (
                <div className="text-center py-16">
                    <div className="font-mono text-xs text-on-surface-variant tracking-widest">NO_ACTIVE_ROUND</div>
                    <p className="font-mono text-sm text-on-surface-variant mt-4">Waiting for the organizer to open a judging round.</p>
                </div>
            )}
        </div>
    );
}
