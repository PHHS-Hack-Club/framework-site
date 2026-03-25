"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";

type Project = { id: string; name: string; description: string; techStack: string; repoUrl: string; demoUrl: string };

export default function ProjectPage() {
    const [project, setProject] = useState<Project | null>(null);
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [success, setSuccess] = useState(false);
    const [err, setErr] = useState<string | null>(null);
    const [form, setForm] = useState({ name: "", description: "", techStack: "", repoUrl: "", demoUrl: "" });

    useEffect(() => {
        fetch("/api/hacker/project").then(r => r.ok ? r.json() : null).then(d => {
            if (d) { setProject(d); setForm({ name: d.name, description: d.description, techStack: d.techStack, repoUrl: d.repoUrl ?? "", demoUrl: d.demoUrl ?? "" }); }
            setLoading(false);
        });
    }, []);

    function update(k: keyof typeof form) { return (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => setForm(p => ({ ...p, [k]: e.target.value })); }

    async function save() {
        setSaving(true); setErr(null); setSuccess(false);
        const res = await fetch("/api/hacker/project", {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(form),
        });
        const data = await res.json();
        if (!res.ok) setErr(data.error); else { setProject(data); setSuccess(true); }
        setSaving(false);
    }

    const input = "w-full bg-surface border border-outline-variant/30 px-4 py-3 font-mono text-sm text-on-surface focus:outline-none focus:border-[#39FF14] transition-colors";
    const label = "font-mono text-xs text-on-surface-variant tracking-widest block mb-2 uppercase";

    if (loading) return <div className="font-mono text-xs text-on-surface-variant animate-pulse">LOADING...</div>;

    return (
        <div className="max-w-2xl space-y-8">
            <div>
                <h1 className="text-4xl font-black italic tracking-tighter uppercase mb-1">
                    {project ? "EDIT_PROJECT" : "SUBMIT_PROJECT"}
                </h1>
                <p className="font-mono text-xs text-on-surface-variant tracking-widest">PROJECT_SUBMISSION_FORM</p>
            </div>

            {err && <div className="p-3 border-l-4 border-error font-mono text-xs text-error">{err}</div>}
            {success && <div className="p-3 border-l-4 border-[#39FF14] font-mono text-xs text-[#39FF14]">PROJECT_SAVED_SUCCESSFULLY</div>}

            <div className="space-y-5">
                <div>
                    <label className={label}>Project Name</label>
                    <input className={input} value={form.name} onChange={update("name")} placeholder="HackBot 3000" required />
                </div>
                <div>
                    <label className={label}>Description</label>
                    <textarea className={`${input} resize-none`} rows={4} value={form.description} onChange={update("description")} placeholder="What does your project do?" />
                </div>
                <div>
                    <label className={label}>Tech Stack</label>
                    <input className={input} value={form.techStack} onChange={update("techStack")} placeholder="Next.js, PostgreSQL, Python, Raspberry Pi..." />
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

            <motion.button whileTap={{ scale: 0.98 }} onClick={save} disabled={saving || !form.name}
                className="w-full py-4 bg-primary-container text-on-primary font-mono text-xs tracking-widest uppercase font-bold disabled:opacity-50 glow-breathe">
                {saving ? "SAVING..." : project ? "UPDATE_PROJECT_" : "SUBMIT_PROJECT_"}
            </motion.button>
        </div>
    );
}
