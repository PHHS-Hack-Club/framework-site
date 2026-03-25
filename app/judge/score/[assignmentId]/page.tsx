"use client";

import { useEffect, useState, use } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";

type Assignment = {
    id: string;
    project: { name: string; description: string; techStack: string; repoUrl: string | null; demoUrl: string | null };
    score: { innovation: number; technicalDepth: number; designUX: number; impact: number; comments: string } | null;
};

const CRITERIA = [
    { key: "innovation", label: "INNOVATION", desc: "Is the idea novel and creative?" },
    { key: "technicalDepth", label: "TECHNICAL_DEPTH", desc: "How complex and well-implemented is the solution?" },
    { key: "designUX", label: "DESIGN_UX", desc: "Is the user experience polished and thoughtful?" },
    { key: "impact", label: "IMPACT", desc: "Does it solve a real problem or create value?" },
] as const;

export default function ScorePage({ params }: { params: Promise<{ assignmentId: string }> }) {
    const { assignmentId } = use(params);
    const router = useRouter();
    const [assignment, setAssignment] = useState<Assignment | null>(null);
    const [loading, setLoading] = useState(true);
    const [scores, setScores] = useState({ innovation: 0, technicalDepth: 0, designUX: 0, impact: 0 });
    const [comments, setComments] = useState("");
    const [submitting, setSubmitting] = useState(false);
    const [err, setErr] = useState<string | null>(null);

    useEffect(() => {
        fetch(`/api/judge/assignments/${assignmentId}`).then(r => r.json()).then(d => {
            setAssignment(d);
            if (d.score) {
                setScores({ innovation: d.score.innovation, technicalDepth: d.score.technicalDepth, designUX: d.score.designUX, impact: d.score.impact });
                setComments(d.score.comments ?? "");
            }
            setLoading(false);
        });
    }, [assignmentId]);

    async function submit() {
        const allScored = Object.values(scores).every(v => v >= 1);
        if (!allScored) { setErr("Please score all 4 criteria before submitting."); return; }
        setSubmitting(true); setErr(null);
        const res = await fetch("/api/judge/score", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ assignmentId, ...scores, comments }),
        });
        if (res.ok) router.push("/judge"); else { const d = await res.json(); setErr(d.error); }
        setSubmitting(false);
    }

    if (loading) return <div className="font-mono text-xs text-on-surface-variant animate-pulse">LOADING...</div>;
    if (!assignment) return <div className="font-mono text-xs text-error">Assignment not found.</div>;

    return (
        <div className="max-w-2xl space-y-8">
            <div>
                <div className="font-mono text-xs text-on-surface-variant tracking-widest mb-2">BLIND_JUDGING // ASSIGNMENT_ID: {assignmentId.slice(0, 8).toUpperCase()}</div>
                <h1 className="text-4xl font-black italic tracking-tighter uppercase mb-1">{assignment.project.name}</h1>
                <div className="font-mono text-xs text-on-surface-variant">{assignment.project.techStack}</div>
            </div>

            <div className="bg-surface-container-high p-6 border border-outline-variant/10">
                <div className="font-mono text-xs text-on-surface-variant tracking-widest mb-3">PROJECT_DESCRIPTION</div>
                <p className="font-mono text-sm leading-relaxed">{assignment.project.description}</p>
                {assignment.project.repoUrl && (
                    <a href={assignment.project.repoUrl} target="_blank" className="font-mono text-xs text-[#39FF14] hover:underline block mt-3">REPO → {assignment.project.repoUrl}</a>
                )}
                {assignment.project.demoUrl && (
                    <a href={assignment.project.demoUrl} target="_blank" className="font-mono text-xs text-[#39FF14] hover:underline block mt-1">DEMO → {assignment.project.demoUrl}</a>
                )}
            </div>

            {err && <div className="p-3 border-l-4 border-error font-mono text-xs text-error">{err}</div>}

            <div className="space-y-6">
                {CRITERIA.map(c => (
                    <div key={c.key}>
                        <div className="flex justify-between items-center mb-1">
                            <label className="font-mono text-xs tracking-widest uppercase text-on-surface">{c.label}</label>
                            <span className={`font-mono font-bold text-lg ${scores[c.key] > 0 ? "text-[#39FF14]" : "text-on-surface-variant"}`}>
                                {scores[c.key] > 0 ? `${scores[c.key]}/5` : "—"}
                            </span>
                        </div>
                        <div className="font-mono text-xs text-on-surface-variant mb-3">{c.desc}</div>
                        <div className="flex gap-3">
                            {[1, 2, 3, 4, 5].map(n => (
                                <motion.button key={n} whileTap={{ scale: 0.9 }} onClick={() => setScores(p => ({ ...p, [c.key]: n }))}
                                    className={`flex-1 py-4 font-mono font-bold text-lg border-2 transition-colors ${scores[c.key] === n ? "border-[#39FF14] text-[#39FF14] bg-[#39FF14]/10" : "border-outline-variant/20 text-on-surface-variant hover:border-outline-variant"}`}>
                                    {n}
                                </motion.button>
                            ))}
                        </div>
                    </div>
                ))}
            </div>

            <div>
                <label className="font-mono text-xs text-on-surface-variant tracking-widest block mb-2">COMMENTS (optional)</label>
                <textarea className="w-full bg-surface border border-outline-variant/30 px-4 py-3 font-mono text-sm text-on-surface focus:outline-none focus:border-[#39FF14] resize-none" rows={4} value={comments} onChange={e => setComments(e.target.value)} />
            </div>

            <motion.button whileTap={{ scale: 0.98 }} onClick={submit} disabled={submitting}
                className="w-full py-5 bg-primary-container text-on-primary font-mono text-sm tracking-widest uppercase font-bold disabled:opacity-50 glow-breathe">
                {submitting ? "SUBMITTING..." : "SUBMIT_SCORES_"}
            </motion.button>
        </div>
    );
}
