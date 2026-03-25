"use client";

import { useState } from "react";
import { motion } from "framer-motion";

const EXPORT_OPTIONS = [
    { key: "ceremony", label: "CEREMONY_DECK", desc: "Awards, winners, project highlights. Designed for the closing ceremony." },
    { key: "projects", label: "ALL_PROJECTS", desc: "All submitted projects with descriptions and team info." },
    { key: "scores", label: "JUDGING_SCORES", desc: "Aggregate scores per project across all judging rounds." },
];

export default function ExportPage() {
    const [selected, setSelected] = useState("ceremony");
    const [exporting, setExporting] = useState(false);
    const [err, setErr] = useState<string | null>(null);

    async function exportPptx() {
        setExporting(true); setErr(null);
        try {
            const res = await fetch(`/api/organizer/export/pptx?type=${selected}`);
            if (!res.ok) { const d = await res.json(); setErr(d.error ?? "Export failed"); return; }
            const blob = await res.blob();
            const url = URL.createObjectURL(blob);
            const a = document.createElement("a");
            a.href = url; a.download = `framework2027_${selected}_${Date.now()}.pptx`;
            a.click(); URL.revokeObjectURL(url);
        } catch (e) {
            setErr("Export failed. Check server logs.");
        } finally {
            setExporting(false);
        }
    }

    return (
        <div className="space-y-8 max-w-2xl">
            <div>
                <h1 className="text-4xl font-black italic tracking-tighter uppercase">EXPORT_CENTER</h1>
                <p className="font-mono text-xs text-on-surface-variant mt-1">Generate PPTX presentations for ceremony and reporting.</p>
            </div>

            {err && <div className="p-4 border-l-4 border-error font-mono text-xs text-error">{err}</div>}

            <div className="space-y-3">
                {EXPORT_OPTIONS.map(opt => (
                    <div key={opt.key} onClick={() => setSelected(opt.key)}
                        className={`p-5 border cursor-pointer transition-colors ${selected === opt.key ? "border-[#39FF14] bg-[#39FF14]/5" : "border-outline-variant/10 bg-surface-container-high hover:border-outline-variant/30"}`}
                    >
                        <div className={`font-mono text-xs tracking-widest font-bold uppercase mb-1 ${selected === opt.key ? "text-[#39FF14]" : "text-on-surface"}`}>{opt.label}</div>
                        <div className="font-mono text-xs text-on-surface-variant">{opt.desc}</div>
                    </div>
                ))}
            </div>

            <motion.button whileTap={{ scale: 0.98 }} onClick={exportPptx} disabled={exporting}
                className="w-full py-4 bg-primary-container text-on-primary font-mono text-xs tracking-widest uppercase font-bold disabled:opacity-50 glow-breathe">
                {exporting ? "GENERATING PPTX..." : "EXPORT_PPTX_↓"}
            </motion.button>

            <div className="bg-surface-container-high p-5 border border-outline-variant/10">
                <div className="font-mono text-xs text-on-surface-variant tracking-widest mb-3">CEREMONY_DECK_INCLUDES</div>
                <ul className="space-y-1 font-mono text-xs text-on-surface-variant">
                    {["Title slide", "Stats overview (hackers, teams, projects)", "Each award + winner project slide", "Top 5 projects by score", "Judge leaderboard", "Photo slide (if uploaded)", "Closing slide"].map(i => (
                        <li key={i} className="flex items-center gap-2"><span className="text-[#39FF14]">›</span>{i}</li>
                    ))}
                </ul>
            </div>
        </div>
    );
}
