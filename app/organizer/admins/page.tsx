"use client";

import { useEffect, useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

type OrganizerEntry = {
    id: string;
    email: string;
    firstName: string | null;
    lastName: string | null;
    createdAt: string;
    isHeadAdmin: boolean;
};

export default function AdminsPage() {
    const [organizers, setOrganizers] = useState<OrganizerEntry[]>([]);
    const [loading, setLoading] = useState(true);
    const [email, setEmail] = useState("");
    const [adding, setAdding] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [success, setSuccess] = useState<string | null>(null);
    const inputRef = useRef<HTMLInputElement>(null);

    async function load() {
        const res = await fetch("/api/organizer/admins");
        if (res.ok) setOrganizers(await res.json());
        setLoading(false);
    }

    useEffect(() => { load(); }, []);

    async function add(e: React.FormEvent) {
        e.preventDefault();
        if (!email.trim()) return;
        setAdding(true);
        setError(null);
        setSuccess(null);

        const res = await fetch("/api/organizer/admins", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ email: email.trim() }),
        });

        const data = await res.json();
        if (!res.ok) {
            setError(data.error);
        } else {
            setOrganizers((prev) => [...prev, data]);
            setEmail("");
            setSuccess(`${data.email} granted organizer access.`);
            inputRef.current?.focus();
        }
        setAdding(false);
    }

    async function remove(id: string, targetEmail: string) {
        if (!confirm(`Revoke organizer access from ${targetEmail}?`)) return;
        setError(null);

        const res = await fetch("/api/organizer/admins", {
            method: "DELETE",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ id }),
        });

        const data = await res.json();
        if (!res.ok) {
            setError(data.error);
        } else {
            setOrganizers((prev) => prev.filter((o) => o.id !== id));
            setSuccess(`${targetEmail} removed from organizers.`);
        }
    }

    return (
        <div className="space-y-8">
            {/* Header */}
            <div>
                <div className="font-mono text-xs text-[#39FF14] tracking-[0.3em] uppercase mb-1">
                    HEAD_ADMIN_ONLY
                </div>
                <h1 className="text-3xl font-black italic uppercase tracking-tighter">
                    ORGANIZER_ACCESS
                </h1>
                <p className="font-mono text-sm text-on-surface-variant mt-2">
                    Grant or revoke organizer panel access. Users must have an existing account.
                </p>
            </div>

            {/* Feedback */}
            <AnimatePresence>
                {(error || success) && (
                    <motion.div
                        initial={{ opacity: 0, y: -8 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0 }}
                        className={`font-mono text-xs px-4 py-3 border ${error
                            ? "border-red-500/40 bg-red-500/10 text-red-400"
                            : "border-[#39FF14]/30 bg-[#39FF14]/8 text-[#39FF14]"
                        }`}
                    >
                        {error ?? success}
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Add organizer */}
            <div className="border border-outline-variant/20 bg-surface-container-high p-6">
                <h2 className="font-mono text-xs tracking-[0.3em] uppercase text-on-surface-variant mb-4">
                    GRANT_ACCESS
                </h2>
                <form onSubmit={add} className="flex gap-3">
                    <input
                        ref={inputRef}
                        type="email"
                        value={email}
                        onChange={(e) => { setEmail(e.target.value); setError(null); setSuccess(null); }}
                        placeholder="user@email.com"
                        className="flex-1 bg-background border border-outline-variant/30 px-4 py-3 font-mono text-sm text-on-surface placeholder:text-on-surface-variant/40 focus:outline-none focus:border-[#39FF14]/50"
                        disabled={adding}
                        autoComplete="off"
                    />
                    <button
                        type="submit"
                        disabled={adding || !email.trim()}
                        className="bg-[#39FF14] text-[#053900] font-mono text-xs font-bold tracking-[0.2em] uppercase px-6 py-3 disabled:opacity-40 hover:brightness-110 transition-all"
                    >
                        {adding ? "ADDING..." : "ADD_ORGANIZER"}
                    </button>
                </form>
            </div>

            {/* Current organizers */}
            <div className="border border-outline-variant/20 bg-surface-container-high">
                <div className="px-6 py-4 border-b border-outline-variant/10 flex items-center justify-between">
                    <h2 className="font-mono text-xs tracking-[0.3em] uppercase text-on-surface-variant">
                        CURRENT_ORGANIZERS
                    </h2>
                    <span className="font-mono text-xs text-[#39FF14]">
                        {loading ? "..." : organizers.length}
                    </span>
                </div>

                {loading ? (
                    <div className="px-6 py-8 font-mono text-xs text-on-surface-variant animate-pulse">
                        LOADING...
                    </div>
                ) : organizers.length === 0 ? (
                    <div className="px-6 py-8 font-mono text-xs text-on-surface-variant">
                        NO_ORGANIZERS_FOUND
                    </div>
                ) : (
                    <ul className="divide-y divide-outline-variant/10">
                        <AnimatePresence>
                            {organizers.map((o) => (
                                <motion.li
                                    key={o.id}
                                    initial={{ opacity: 0 }}
                                    animate={{ opacity: 1 }}
                                    exit={{ opacity: 0, height: 0, overflow: "hidden" }}
                                    className="flex items-center justify-between px-6 py-4 gap-4"
                                >
                                    <div className="flex items-center gap-3 min-w-0">
                                        <div className="min-w-0">
                                            <div className="flex items-center gap-2">
                                                <span className="font-mono text-sm text-on-surface truncate">
                                                    {o.email}
                                                </span>
                                                {o.isHeadAdmin && (
                                                    <span className="shrink-0 font-mono text-[9px] tracking-[0.25em] uppercase bg-[#39FF14]/15 text-[#39FF14] border border-[#39FF14]/30 px-2 py-0.5">
                                                        HEAD_ADMIN
                                                    </span>
                                                )}
                                            </div>
                                            {(o.firstName || o.lastName) && (
                                                <div className="font-mono text-xs text-on-surface-variant mt-0.5">
                                                    {[o.firstName, o.lastName].filter(Boolean).join(" ")}
                                                </div>
                                            )}
                                        </div>
                                    </div>

                                    {!o.isHeadAdmin && (
                                        <button
                                            onClick={() => remove(o.id, o.email)}
                                            className="shrink-0 font-mono text-[10px] tracking-widest uppercase text-red-400 border border-red-400/20 px-3 py-1.5 hover:bg-red-400/8 hover:border-red-400/40 transition-colors"
                                        >
                                            REVOKE
                                        </button>
                                    )}
                                </motion.li>
                            ))}
                        </AnimatePresence>
                    </ul>
                )}
            </div>
        </div>
    );
}
