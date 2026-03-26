"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { motion } from "framer-motion";

export default function SignupPage() {
    const router = useRouter();
    const [form, setForm] = useState({ firstName: "", lastName: "", email: "", password: "", confirm: "" });
    const [loading, setLoading] = useState(false);
    const [err, setErr] = useState<string | null>(null);
    const [success, setSuccess] = useState(false);

    function update(k: keyof typeof form) {
        return (e: React.ChangeEvent<HTMLInputElement>) => setForm((p) => ({ ...p, [k]: e.target.value }));
    }

    async function handleSubmit(e: React.FormEvent) {
        e.preventDefault();
        setErr(null);
        if (form.password !== form.confirm) { setErr("Passwords do not match."); return; }
        setLoading(true);
        try {
            const res = await fetch("/api/auth/signup", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ email: form.email, password: form.password, firstName: form.firstName, lastName: form.lastName }),
            });
            const data = await res.json();
            if (!res.ok) { setErr(data.error); return; }
            setSuccess(true);
        } finally {
            setLoading(false);
        }
    }

    if (success) {
        return (
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
                className="bg-surface-container-high border border-[#39FF14]/30 p-8 text-center"
            >
                <div className="text-[#39FF14] font-mono text-5xl mb-4">✓</div>
                <h2 className="text-xl font-black italic tracking-tighter uppercase mb-2">CHECK_YOUR_EMAIL</h2>
                <p className="font-mono text-sm text-on-surface-variant mb-5">
                    A verification link has been sent to <strong className="text-on-surface">{form.email}</strong>.
                    Click it to activate your account.
                </p>
                <div className="text-left border border-yellow-400/30 bg-yellow-400/5 p-4 space-y-2">
                    <p className="font-mono text-xs text-yellow-400 font-bold tracking-widest">⚠ DIDN&apos;T RECEIVE IT?</p>
                    <p className="font-mono text-xs text-yellow-400/80 leading-relaxed">
                        Check your <strong className="text-yellow-400">spam or junk folder</strong> — our emails occasionally land there.
                        If you find it, please mark it as <strong className="text-yellow-400">Not Spam</strong> so future emails reach your inbox.
                    </p>
                </div>
            </motion.div>
        );
    }

    return (
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
            className="bg-surface-container-high border border-outline-variant/20 p-8"
        >
            <h1 className="text-2xl font-black italic tracking-tighter uppercase mb-1">CREATE ACCOUNT</h1>
            <p className="font-mono text-xs text-on-surface-variant tracking-widest mb-8">REGISTER_NEW_OPERATOR</p>

            {err && (
                <div className="mb-6 p-3 border-l-4 border-error bg-error/5 font-mono text-xs text-error">{err}</div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                    {[["firstName", "FIRST_NAME", "text"], ["lastName", "LAST_NAME", "text"]].map(([k, label, t]) => (
                        <div key={k}>
                            <label className="font-mono text-xs text-on-surface-variant tracking-widest block mb-2">{label}</label>
                            <input type={t} value={form[k as keyof typeof form]} onChange={update(k as keyof typeof form)}
                                className="w-full bg-surface border border-outline-variant/30 px-4 py-3 font-mono text-sm text-on-surface focus:outline-none focus:border-[#39FF14] transition-colors" />
                        </div>
                    ))}
                </div>

                <div>
                    <label className="font-mono text-xs text-on-surface-variant tracking-widest block mb-2">EMAIL</label>
                    <input type="email" value={form.email} onChange={update("email")} required
                        className="w-full bg-surface border border-outline-variant/30 px-4 py-3 font-mono text-sm text-on-surface focus:outline-none focus:border-[#39FF14] transition-colors"
                        placeholder="you@school.edu" />
                </div>

                <div>
                    <label className="font-mono text-xs text-on-surface-variant tracking-widest block mb-2">PASSWORD</label>
                    <input type="password" value={form.password} onChange={update("password")} required minLength={8}
                        className="w-full bg-surface border border-outline-variant/30 px-4 py-3 font-mono text-sm text-on-surface focus:outline-none focus:border-[#39FF14] transition-colors" />
                </div>

                <div>
                    <label className="font-mono text-xs text-on-surface-variant tracking-widest block mb-2">CONFIRM_PASSWORD</label>
                    <input type="password" value={form.confirm} onChange={update("confirm")} required
                        className="w-full bg-surface border border-outline-variant/30 px-4 py-3 font-mono text-sm text-on-surface focus:outline-none focus:border-[#39FF14] transition-colors" />
                </div>

                <motion.button whileHover={{ scale: 1.01 }} whileTap={{ scale: 0.98 }}
                    type="submit" disabled={loading}
                    className="w-full bg-primary-container text-on-primary py-4 font-mono font-bold tracking-widest uppercase text-sm disabled:opacity-50 glow-breathe mt-2"
                >
                    {loading ? "CREATING_ACCOUNT..." : "REGISTER_"}
                </motion.button>
            </form>

            <p className="font-mono text-xs text-on-surface-variant text-center mt-6">
                Already have an account?{" "}
                <Link href="/auth/login" className="text-[#39FF14] hover:underline">LOGIN_</Link>
            </p>
        </motion.div>
    );
}
