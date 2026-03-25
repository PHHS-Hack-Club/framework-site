"use client";

import { Suspense } from "react";
import { useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { motion } from "framer-motion";

function LoginForm() {
    const router = useRouter();
    const params = useSearchParams();
    const verified = params.get("verified");
    const error = params.get("error");

    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [loading, setLoading] = useState(false);
    const [err, setErr] = useState<string | null>(null);

    async function handleSubmit(e: React.FormEvent) {
        e.preventDefault();
        setLoading(true);
        setErr(null);
        try {
            const res = await fetch("/api/auth/login", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ email, password }),
            });
            const data = await res.json();
            if (!res.ok) {
                setErr(data.error);
                return;
            }
            router.push(data.redirect);
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
                LOGIN
            </h1>
            <p className="font-mono text-xs text-on-surface-variant tracking-widest mb-8">
                AUTHENTICATE_TO_CONTINUE
            </p>

            {verified && (
                <div className="mb-6 p-3 border-l-4 border-[#39FF14] bg-[#39FF14]/5 font-mono text-xs text-[#39FF14]">
                    EMAIL_VERIFIED — You can now log in.
                </div>
            )}
            {(err || error === "unauthorized") && (
                <div className="mb-6 p-3 border-l-4 border-error bg-error/5 font-mono text-xs text-error">
                    {err ?? "ACCESS_DENIED — Insufficient permissions."}
                </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-5">
                <div>
                    <label className="font-mono text-xs text-on-surface-variant tracking-widest block mb-2">
                        EMAIL
                    </label>
                    <input
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                        className="w-full bg-surface border border-outline-variant/30 px-4 py-3 font-mono text-sm text-on-surface focus:outline-none focus:border-[#39FF14] transition-colors"
                        placeholder="you@school.edu"
                    />
                </div>
                <div>
                    <label className="font-mono text-xs text-on-surface-variant tracking-widest block mb-2">
                        PASSWORD
                    </label>
                    <input
                        type="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                        className="w-full bg-surface border border-outline-variant/30 px-4 py-3 font-mono text-sm text-on-surface focus:outline-none focus:border-[#39FF14] transition-colors"
                    />
                </div>

                <motion.button
                    whileHover={{ scale: 1.01 }}
                    whileTap={{ scale: 0.98 }}
                    type="submit"
                    disabled={loading}
                    className="w-full bg-primary-container text-on-primary py-4 font-mono font-bold tracking-widest uppercase text-sm disabled:opacity-50 glow-breathe"
                >
                    {loading ? "AUTHENTICATING..." : "LOGIN_"}
                </motion.button>
            </form>

            <p className="font-mono text-xs text-on-surface-variant text-center mt-6">
                No account?{" "}
                <Link href="/auth/signup" className="text-[#39FF14] hover:underline">
                    REGISTER_
                </Link>
            </p>
        </motion.div>
    );
}

export default function LoginPage() {
    return (
        <Suspense fallback={
            <div className="bg-surface-container-high border border-outline-variant/20 p-8 font-mono text-xs text-on-surface-variant animate-pulse">
                LOADING_AUTH_TERMINAL...
            </div>
        }>
            <LoginForm />
        </Suspense>
    );
}
