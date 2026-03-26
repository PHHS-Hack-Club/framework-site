"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";

const AUDIENCES = [
    { key: "ALL", label: "All Registered Users" },
    { key: "ACCEPTED", label: "Accepted Hackers" },
    { key: "WAITLISTED", label: "Waitlisted" },
    { key: "PENDING", label: "Pending Review" },
];

const TEMPLATES = [
    { key: "custom", label: "Custom", subject: "", body: "" },
    { key: "accepted", label: "Acceptance", subject: "You've been accepted to Framework 2027!", body: "Congratulations! We're thrilled to invite you to Framework 2027 on [DATE] at Pascack Hills High School. Please confirm your attendance by [DEADLINE]." },
    { key: "reminder", label: "Reminder", subject: "Framework 2027 — Event Reminder", body: "Just a reminder that Framework 2027 is happening on [DATE]. Check-in opens at [TIME]. Can't wait to see what you build!" },
    { key: "waitlist", label: "Waitlist", subject: "Framework 2027 — Waitlist Update", body: "Thank you for your interest in Framework 2027. You're currently on our waitlist. We'll notify you if a spot opens up." },
];

export default function MassEmailPage() {
    const [audience, setAudience] = useState("ACCEPTED");
    const [template, setTemplate] = useState("custom");
    const [subject, setSubject] = useState("");
    const [body, setBody] = useState("");
    const [sending, setSending] = useState(false);
    const [result, setResult] = useState<{ count: number } | null>(null);
    const [err, setErr] = useState<string | null>(null);
    const [preview, setPreview] = useState<string[]>([]);

    useEffect(() => {
        fetch(`/api/organizer/email/preview?audience=${audience}`)
            .then(r => r.json()).then(d => setPreview(d.emails ?? []));
    }, [audience]);

    function applyTemplate(key: string) {
        setTemplate(key);
        const t = TEMPLATES.find(t => t.key === key);
        if (t && t.key !== "custom") { setSubject(t.subject); setBody(t.body); }
    }

    async function send() {
        setErr(null); setSending(true); setResult(null);
        const res = await fetch("/api/organizer/email/send", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ audience, subject, body }),
        });
        const data = await res.json();
        if (!res.ok) setErr(data.error); else setResult(data);
        setSending(false);
    }

    const input = "w-full bg-surface border border-outline-variant/30 px-4 py-3 font-mono text-sm text-on-surface focus:outline-none focus:border-[#39FF14] transition-colors";

    return (
        <div className="space-y-8">
            <div>
                <h1 className="text-4xl font-black italic tracking-tighter uppercase mb-1">MASS_EMAIL</h1>
                <div className="font-mono text-xs text-on-surface-variant">Send emails to groups of participants</div>
            </div>

            {result && <div className="p-4 border-l-4 border-[#39FF14] bg-[#39FF14]/5 font-mono text-sm text-[#39FF14]">✓ Sent to {result.count} recipients</div>}
            {err && <div className="p-4 border-l-4 border-error font-mono text-sm text-error">{err}</div>}

            <div className="grid grid-cols-3 gap-8">
                <div className="col-span-2 space-y-6">
                    {/* Audience */}
                    <div>
                        <div className="font-mono text-xs text-on-surface-variant tracking-widest mb-3">AUDIENCE</div>
                        <div className="flex flex-wrap gap-2">
                            {AUDIENCES.map(a => (
                                <button key={a.key} onClick={() => setAudience(a.key)}
                                    className={`font-mono text-xs tracking-widest uppercase px-4 py-2 border transition-colors ${audience === a.key ? "border-[#39FF14] text-[#39FF14] bg-[#39FF14]/5" : "border-outline-variant/20 text-on-surface-variant hover:border-outline-variant"}`}>
                                    {a.label}
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* Template */}
                    <div>
                        <div className="font-mono text-xs text-on-surface-variant tracking-widest mb-3">TEMPLATE</div>
                        <div className="flex gap-2">
                            {TEMPLATES.map(t => (
                                <button key={t.key} onClick={() => applyTemplate(t.key)}
                                    className={`font-mono text-xs tracking-widest uppercase px-3 py-1.5 border transition-colors ${template === t.key ? "border-[#39FF14] text-[#39FF14]" : "border-outline-variant/20 text-on-surface-variant hover:border-outline-variant"}`}>
                                    {t.label}
                                </button>
                            ))}
                        </div>
                    </div>

                    <div>
                        <label className="font-mono text-xs text-on-surface-variant tracking-widest block mb-2">SUBJECT</label>
                        <input className={input} value={subject} onChange={e => setSubject(e.target.value)} placeholder="Email subject..." />
                    </div>

                    <div>
                        <label className="font-mono text-xs text-on-surface-variant tracking-widest block mb-2">BODY</label>
                        <textarea className={`${input} resize-none`} rows={10} value={body} onChange={e => setBody(e.target.value)} placeholder="Email body..." />
                    </div>

                    <motion.button whileTap={{ scale: 0.98 }} onClick={send} disabled={sending || !subject || !body}
                        className="w-full py-4 bg-primary-container text-on-primary font-mono text-xs tracking-widest uppercase font-bold disabled:opacity-50 glow-breathe">
                        {sending ? "TRANSMITTING..." : `SEND TO ${preview.length} RECIPIENTS_`}
                    </motion.button>
                </div>

                {/* Preview panel */}
                <div className="bg-surface-container-high p-5 border border-outline-variant/10 h-fit sticky top-8">
                    <div className="font-mono text-xs text-on-surface-variant tracking-widest mb-4">RECIPIENT_PREVIEW ({preview.length})</div>
                    <div className="space-y-2 max-h-96 overflow-y-auto">
                        {preview.slice(0, 20).map(e => (
                            <div key={e} className="font-mono text-xs text-on-surface truncate">{e}</div>
                        ))}
                        {preview.length > 20 && <div className="font-mono text-xs text-on-surface-variant">+{preview.length - 20} more...</div>}
                        {preview.length === 0 && <div className="font-mono text-xs text-on-surface-variant">No recipients</div>}
                    </div>
                </div>
            </div>
        </div>
    );
}
