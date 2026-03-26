"use client";

import { useEffect, useState, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";

type Member = {
    id: string;
    email: string;
    firstName: string | null;
    lastName: string | null;
    role: "HACKER" | "JUDGE" | "ORGANIZER";
    emailVerified: boolean;
    createdAt: string;
    application: { status: string } | null;
};

const ROLE_COLORS: Record<string, string> = {
    HACKER: "text-on-surface-variant border-outline-variant/30",
    JUDGE: "text-yellow-400 border-yellow-400/30",
    ORGANIZER: "text-[#39FF14] border-[#39FF14]/30",
};

const STATUS_COLORS: Record<string, string> = {
    PENDING: "text-yellow-400",
    ACCEPTED: "text-[#39FF14]",
    REJECTED: "text-error",
    WAITLISTED: "text-on-surface-variant",
};

export default function MembersPage() {
    const [members, setMembers] = useState<Member[]>([]);
    const [loading, setLoading] = useState(true);
    const [search, setSearch] = useState("");
    const [roleFilter, setRoleFilter] = useState<"ALL" | Member["role"]>("ALL");
    const [deleting, setDeleting] = useState<string | null>(null);
    const [err, setErr] = useState<string | null>(null);

    async function load() {
        const res = await fetch("/api/organizer/members");
        if (res.ok) setMembers(await res.json());
        setLoading(false);
    }

    useEffect(() => { load(); }, []);

    async function remove(member: Member) {
        const label = member.firstName ? `${member.firstName} ${member.lastName ?? ""}`.trim() : member.email;
        if (!confirm(`Permanently delete account for ${label}? This cannot be undone.`)) return;
        setDeleting(member.id);
        setErr(null);
        const res = await fetch(`/api/organizer/members/${member.id}`, { method: "DELETE" });
        if (res.ok) {
            setMembers(prev => prev.filter(m => m.id !== member.id));
        } else {
            const data = await res.json();
            setErr(data.error);
        }
        setDeleting(null);
    }

    const filtered = useMemo(() => {
        const q = search.toLowerCase();
        return members.filter(m => {
            if (roleFilter !== "ALL" && m.role !== roleFilter) return false;
            if (!q) return true;
            return (
                m.email.toLowerCase().includes(q) ||
                (m.firstName?.toLowerCase().includes(q) ?? false) ||
                (m.lastName?.toLowerCase().includes(q) ?? false)
            );
        });
    }, [members, search, roleFilter]);

    return (
        <div className="space-y-6">
            <div>
                <div className="font-mono text-xs text-[#39FF14] tracking-[0.3em] uppercase mb-1">ORGANIZER_PANEL</div>
                <h1 className="text-3xl font-black italic uppercase tracking-tighter">MEMBERS</h1>
                <p className="font-mono text-sm text-on-surface-variant mt-1">{loading ? "..." : `${members.length} ACCOUNTS`}</p>
            </div>

            {err && (
                <div className="font-mono text-xs text-error border border-error/20 px-4 py-3">
                    {err}
                </div>
            )}

            {/* Filters */}
            <div className="flex flex-col sm:flex-row gap-3">
                <input
                    type="search"
                    placeholder="SEARCH by name or email..."
                    value={search}
                    onChange={e => setSearch(e.target.value)}
                    className="flex-1 bg-surface border border-outline-variant/30 px-4 py-2.5 font-mono text-xs text-on-surface placeholder:text-on-surface-variant/40 focus:outline-none focus:border-[#39FF14] transition-colors"
                />
                <div className="flex gap-2">
                    {(["ALL", "HACKER", "JUDGE", "ORGANIZER"] as const).map(r => (
                        <button key={r} onClick={() => setRoleFilter(r)}
                            className={`px-3 py-2.5 font-mono text-[10px] tracking-widest border transition-colors ${roleFilter === r ? "border-[#39FF14] text-[#39FF14] bg-[#39FF14]/5" : "border-outline-variant/20 text-on-surface-variant hover:border-outline-variant"}`}>
                            {r}
                        </button>
                    ))}
                </div>
            </div>

            {/* Table */}
            <div className="border border-outline-variant/20">
                <div className="hidden sm:grid grid-cols-[1fr_1fr_100px_100px_80px] gap-4 px-5 py-3 border-b border-outline-variant/10 font-mono text-[10px] tracking-[0.25em] text-on-surface-variant uppercase">
                    <span>Account</span>
                    <span>Email</span>
                    <span>Role</span>
                    <span>Application</span>
                    <span />
                </div>

                {loading ? (
                    <div className="px-5 py-10 font-mono text-xs text-on-surface-variant animate-pulse">LOADING...</div>
                ) : filtered.length === 0 ? (
                    <div className="px-5 py-10 font-mono text-xs text-on-surface-variant">NO_RESULTS</div>
                ) : (
                    <ul className="divide-y divide-outline-variant/10">
                        <AnimatePresence initial={false}>
                            {filtered.map(m => (
                                <motion.li
                                    key={m.id}
                                    initial={{ opacity: 1 }}
                                    exit={{ opacity: 0, height: 0, overflow: "hidden" }}
                                    transition={{ duration: 0.2 }}
                                    className="grid grid-cols-1 sm:grid-cols-[1fr_1fr_100px_100px_80px] gap-2 sm:gap-4 px-5 py-4 items-center"
                                >
                                    {/* Name + verified badge */}
                                    <div className="min-w-0">
                                        <div className="font-mono text-sm text-on-surface truncate">
                                            {m.firstName || m.lastName
                                                ? `${m.firstName ?? ""} ${m.lastName ?? ""}`.trim()
                                                : <span className="text-on-surface-variant italic">No name</span>
                                            }
                                        </div>
                                        <div className="font-mono text-[10px] text-on-surface-variant mt-0.5">
                                            {m.emailVerified ? (
                                                <span className="text-[#39FF14]/70">✓ verified</span>
                                            ) : (
                                                <span className="text-yellow-400/70">unverified</span>
                                            )}
                                        </div>
                                    </div>

                                    {/* Email */}
                                    <div className="font-mono text-xs text-on-surface-variant truncate">{m.email}</div>

                                    {/* Role */}
                                    <div>
                                        <span className={`font-mono text-[10px] border px-2 py-0.5 tracking-widest ${ROLE_COLORS[m.role]}`}>
                                            {m.role}
                                        </span>
                                    </div>

                                    {/* App status */}
                                    <div className={`font-mono text-[10px] tracking-widest ${m.application ? STATUS_COLORS[m.application.status] : "text-on-surface-variant/40"}`}>
                                        {m.application ? m.application.status : "NONE"}
                                    </div>

                                    {/* Delete */}
                                    <div>
                                        {m.role !== "ORGANIZER" && (
                                            <button
                                                onClick={() => remove(m)}
                                                disabled={deleting === m.id}
                                                className="font-mono text-[10px] tracking-widest uppercase text-red-400 border border-red-400/20 px-3 py-1.5 hover:bg-red-400/8 hover:border-red-400/40 transition-colors disabled:opacity-40"
                                            >
                                                {deleting === m.id ? "..." : "DELETE"}
                                            </button>
                                        )}
                                    </div>
                                </motion.li>
                            ))}
                        </AnimatePresence>
                    </ul>
                )}
            </div>
        </div>
    );
}
