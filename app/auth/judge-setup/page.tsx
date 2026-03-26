"use client";

import { Suspense, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";

function JudgeSetupForm() {
    const router = useRouter();
    const params = useSearchParams();
    const token = params.get("token") ?? "";

    const [password, setPassword] = useState("");
    const [confirm, setConfirm] = useState("");
    const [loading, setLoading] = useState(false);
    const [err, setErr] = useState<string | null>(null);
    const [done, setDone] = useState(false);

    if (!token) {
        return (
            <div className="p-4 border-l-4 border-error bg-error/5 font-mono text-xs text-error leading-relaxed">
                INVALID_LINK — No invite token found. Contact the organizers for a new invite.
            </div>
        );
    }

    async function handleSubmit(e: React.FormEvent) {
        e.preventDefault();
        if (password !== confirm) { setErr("Passwords do not match."); return; }
        setLoading(true);
        setErr(null);
        try {
            const res = await fetch("/api/auth/judge-setup", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ token, password }),
            });
            const data = await res.json();
            if (!res.ok) {
                setErr(data.error);
            } else {
                setDone(true);
                router.push(data.redirect);
            }
        } finally {
            setLoading(false);
        }
    }

    return (
        <AnimatePresence mode="wait">
            {done ? (
                <motion.div key="done" initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }}
                    className="p-4 border-l-4 border-[#39FF14] bg-[#39FF14]/5 font-mono text-xs text-[#39FF14]">
                    PASSWORD_SET — Redirecting to dashboard...
                </motion.div>
            ) : (
                <motion.form key="form" onSubmit={handleSubmit} className="space-y-5">
                    {err && (
                        <div className="p-3 border-l-4 border-error bg-error/5 font-mono text-xs text-error">{err}</div>
                    )}
                    <div>
                        <label className="font-mono text-xs text-on-surface-variant tracking-widest block mb-2">PASSWORD</label>
                        <input
                            type="password"
                            value={password}
                            onChange={e => { setPassword(e.target.value); setErr(null); }}
                            required
                            minLength={8}
                            autoFocus
                            className="w-full bg-surface border border-outline-variant/30 px-4 py-3 font-mono text-sm text-on-surface focus:outline-none focus:border-[#39FF14] transition-colors"
                            disabled={loading}
                        />
                    </div>
                    <div>
                        <label className="font-mono text-xs text-on-surface-variant tracking-widest block mb-2">CONFIRM_PASSWORD</label>
                        <input
                            type="password"
                            value={confirm}
                            onChange={e => { setConfirm(e.target.value); setErr(null); }}
                            required
                            className="w-full bg-surface border border-outline-variant/30 px-4 py-3 font-mono text-sm text-on-surface focus:outline-none focus:border-[#39FF14] transition-colors"
                            disabled={loading}
                        />
                    </div>
                    <motion.button
                        whileHover={{ scale: 1.01 }} whileTap={{ scale: 0.98 }}
                        type="submit"
                        disabled={loading || !password || !confirm}
                        className="w-full bg-primary-container px-4 py-4 font-mono text-sm font-bold uppercase leading-tight tracking-[0.14em] text-on-primary [overflow-wrap:anywhere] disabled:opacity-50 glow-breathe sm:tracking-widest"
                    >
                        {loading ? "SETTING UP..." : "SET_PASSWORD & ACCESS_DASHBOARD →"}
                    </motion.button>
                </motion.form>
            )}
        </AnimatePresence>
    );
}

export default function JudgeSetupPage() {
    return (
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
            className="bg-surface-container-high border border-outline-variant/20 p-8"
        >
            <div className="font-mono text-xs text-[#39FF14] tracking-[0.3em] uppercase mb-1">FRAMEWORK_2027</div>
            <h1 className="text-2xl font-black italic tracking-tighter uppercase mb-1">JUDGE_SETUP</h1>
            <p className="mb-8 font-mono text-xs leading-relaxed tracking-[0.16em] text-on-surface-variant [overflow-wrap:anywhere] sm:tracking-widest">
                CREATE_YOUR_PASSWORD_TO_ACCESS_THE_JUDGE_DASHBOARD
            </p>
            <Suspense fallback={<div className="font-mono text-xs text-on-surface-variant animate-pulse">LOADING...</div>}>
                <JudgeSetupForm />
            </Suspense>
        </motion.div>
    );
}
