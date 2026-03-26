"use client";

import { Suspense, useState } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";

function ResetPasswordForm() {
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
            <div className="p-4 border-l-4 border-error bg-error/5 font-mono text-xs text-error">
                INVALID_LINK — No reset token found.{" "}
                <Link href="/auth/forgot-password" className="underline">Request a new one.</Link>
            </div>
        );
    }

    async function handleSubmit(e: React.FormEvent) {
        e.preventDefault();
        if (password !== confirm) { setErr("Passwords do not match."); return; }
        setLoading(true);
        setErr(null);
        try {
            const res = await fetch("/api/auth/reset-password", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ token, password }),
            });
            const data = await res.json();
            if (!res.ok) {
                setErr(data.error);
            } else {
                setDone(true);
                setTimeout(() => router.push("/auth/login?reset=1"), 2500);
            }
        } finally {
            setLoading(false);
        }
    }

    return (
        <AnimatePresence mode="wait">
            {done ? (
                <motion.div
                    key="done"
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="p-4 border-l-4 border-[#39FF14] bg-[#39FF14]/5 font-mono text-xs text-[#39FF14]"
                >
                    PASSWORD_UPDATED — Redirecting to login...
                </motion.div>
            ) : (
                <motion.form key="form" onSubmit={handleSubmit} className="space-y-5">
                    {err && (
                        <div className="p-3 border-l-4 border-error bg-error/5 font-mono text-xs text-error">
                            {err}
                        </div>
                    )}
                    <div>
                        <label className="font-mono text-xs text-on-surface-variant tracking-widest block mb-2">
                            NEW PASSWORD
                        </label>
                        <input
                            type="password"
                            value={password}
                            onChange={(e) => { setPassword(e.target.value); setErr(null); }}
                            required
                            minLength={8}
                            autoFocus
                            className="w-full bg-surface border border-outline-variant/30 px-4 py-3 font-mono text-sm text-on-surface focus:outline-none focus:border-[#39FF14] transition-colors"
                            disabled={loading}
                        />
                    </div>
                    <div>
                        <label className="font-mono text-xs text-on-surface-variant tracking-widest block mb-2">
                            CONFIRM PASSWORD
                        </label>
                        <input
                            type="password"
                            value={confirm}
                            onChange={(e) => { setConfirm(e.target.value); setErr(null); }}
                            required
                            className="w-full bg-surface border border-outline-variant/30 px-4 py-3 font-mono text-sm text-on-surface focus:outline-none focus:border-[#39FF14] transition-colors"
                            disabled={loading}
                        />
                    </div>

                    <motion.button
                        whileHover={{ scale: 1.01 }}
                        whileTap={{ scale: 0.98 }}
                        type="submit"
                        disabled={loading || !password || !confirm}
                        className="w-full bg-primary-container text-on-primary py-4 font-mono font-bold tracking-widest uppercase text-sm disabled:opacity-50 glow-breathe"
                    >
                        {loading ? "UPDATING..." : "SET_NEW_PASSWORD_"}
                    </motion.button>
                </motion.form>
            )}
        </AnimatePresence>
    );
}

export default function ResetPasswordPage() {
    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-surface-container-high border border-outline-variant/20 p-8"
        >
            <h1 className="text-2xl font-black italic tracking-tighter uppercase mb-1">
                RESET_PASSWORD
            </h1>
            <p className="font-mono text-xs text-on-surface-variant tracking-widest mb-8">
                CHOOSE_A_NEW_PASSWORD
            </p>
            <Suspense fallback={
                <div className="font-mono text-xs text-on-surface-variant animate-pulse">LOADING...</div>
            }>
                <ResetPasswordForm />
            </Suspense>
        </motion.div>
    );
}
