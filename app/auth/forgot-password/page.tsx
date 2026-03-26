"use client";

import { useState } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";

export default function ForgotPasswordPage() {
    const [email, setEmail] = useState("");
    const [loading, setLoading] = useState(false);
    const [sent, setSent] = useState(false);
    const [err, setErr] = useState<string | null>(null);

    async function handleSubmit(e: React.FormEvent) {
        e.preventDefault();
        setLoading(true);
        setErr(null);
        try {
            const res = await fetch("/api/auth/forgot-password", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ email }),
            });
            if (!res.ok) {
                const data = await res.json();
                setErr(data.error);
            } else {
                setSent(true);
            }
        } finally {
            setLoading(false);
        }
    }

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-surface-container-high border border-outline-variant/20 p-8"
        >
            <h1 className="text-2xl font-black italic tracking-tighter uppercase mb-1">
                FORGOT_PASSWORD
            </h1>
            <p className="font-mono text-xs text-on-surface-variant tracking-widest mb-8">
                ENTER_EMAIL_TO_RESET
            </p>

            <AnimatePresence mode="wait">
                {sent ? (
                    <motion.div
                        key="sent"
                        initial={{ opacity: 0, y: 8 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="space-y-6"
                    >
                        <div className="p-4 border-l-4 border-[#39FF14] bg-[#39FF14]/5 font-mono text-xs text-[#39FF14] leading-relaxed">
                            RESET_LINK_SENT — If an account exists for that email, you&apos;ll
                            receive a password reset link within a few minutes.
                        </div>
                        <div className="border border-yellow-400/30 bg-yellow-400/5 p-4 space-y-2">
                            <p className="font-mono text-xs text-yellow-400 font-bold tracking-widest">⚠ DIDN&apos;T RECEIVE IT?</p>
                            <p className="font-mono text-xs text-yellow-400/80 leading-relaxed">
                                Check your <strong className="text-yellow-400">spam or junk folder</strong> — our emails occasionally land there.
                                If you find it, please mark it as <strong className="text-yellow-400">Not Spam</strong> so future emails reach your inbox.
                            </p>
                        </div>
                        <Link
                            href="/auth/login"
                            className="block text-center font-mono text-xs text-on-surface-variant hover:text-on-surface transition-colors"
                        >
                            ← BACK_TO_LOGIN
                        </Link>
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
                                EMAIL
                            </label>
                            <input
                                type="email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                required
                                autoFocus
                                className="w-full bg-surface border border-outline-variant/30 px-4 py-3 font-mono text-sm text-on-surface focus:outline-none focus:border-[#39FF14] transition-colors"
                                placeholder="you@school.edu"
                                disabled={loading}
                            />
                        </div>

                        <motion.button
                            whileHover={{ scale: 1.01 }}
                            whileTap={{ scale: 0.98 }}
                            type="submit"
                            disabled={loading || !email.trim()}
                            className="w-full bg-primary-container text-on-primary py-4 font-mono font-bold tracking-widest uppercase text-sm disabled:opacity-50 glow-breathe"
                        >
                            {loading ? "SENDING..." : "SEND_RESET_LINK_"}
                        </motion.button>

                        <p className="font-mono text-xs text-on-surface-variant text-center">
                            <Link href="/auth/login" className="hover:text-on-surface transition-colors">
                                ← BACK_TO_LOGIN
                            </Link>
                        </p>
                    </motion.form>
                )}
            </AnimatePresence>
        </motion.div>
    );
}
