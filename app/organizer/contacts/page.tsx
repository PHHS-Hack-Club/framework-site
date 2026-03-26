"use client";

import { useEffect, useMemo, useState } from "react";
import { useSearchParams } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";

type ContactResponse = {
    id: string;
    subject: string;
    body: string;
    sentByEmail: string;
    sentByName: string | null;
    sentAt: string;
};

type ContactMessage = {
    id: string;
    name: string;
    email: string;
    subject: string;
    message: string;
    status: "NEW" | "RESPONDED" | "ARCHIVED";
    responseCount: number;
    respondedAt: string | null;
    createdAt: string;
    responses: ContactResponse[];
};

const STATUS_TABS = ["ALL", "NEW", "RESPONDED", "ARCHIVED"] as const;

const STATUS_STYLES: Record<ContactMessage["status"], string> = {
    NEW: "border-yellow-400/30 bg-yellow-400/10 text-yellow-300",
    RESPONDED: "border-[#39FF14]/30 bg-[#39FF14]/10 text-[#39FF14]",
    ARCHIVED: "border-outline-variant/30 bg-surface text-on-surface-variant",
};

export default function OrganizerContactsPage() {
    const searchParams = useSearchParams();
    const preselectedId = searchParams.get("message");

    const [contacts, setContacts] = useState<ContactMessage[]>([]);
    const [selectedId, setSelectedId] = useState<string | null>(preselectedId);
    const [filter, setFilter] = useState<(typeof STATUS_TABS)[number]>("ALL");
    const [loading, setLoading] = useState(true);
    const [acting, setActing] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [replySubject, setReplySubject] = useState("");
    const [replyBody, setReplyBody] = useState("");

    async function load() {
        setLoading(true);
        setError(null);
        const res = await fetch("/api/organizer/contacts");
        const data = await res.json().catch(() => []);
        if (!res.ok) {
            setError(data.error ?? "Failed to load contact inbox.");
        } else {
            setContacts(data);
            setSelectedId((current) => {
                if (current && data.some((contact: ContactMessage) => contact.id === current)) return current;
                if (preselectedId && data.some((contact: ContactMessage) => contact.id === preselectedId)) return preselectedId;
                return data[0]?.id ?? null;
            });
        }
        setLoading(false);
    }

    useEffect(() => {
        load();
    }, [preselectedId]);

    const filtered = useMemo(() => {
        if (filter === "ALL") return contacts;
        return contacts.filter((contact) => contact.status === filter);
    }, [contacts, filter]);

    const selected =
        contacts.find((contact) => contact.id === selectedId) ??
        filtered[0] ??
        null;

    useEffect(() => {
        if (!selected) {
            setReplySubject("");
            setReplyBody("");
            return;
        }
        setReplySubject((current) => current || `Re: ${selected.subject}`);
        setReplyBody("");
    }, [selected?.id]);

    async function updateStatus(id: string, status: ContactMessage["status"]) {
        setActing(true);
        setError(null);
        const res = await fetch(`/api/organizer/contacts/${id}`, {
            method: "PATCH",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ status }),
        });
        const data = await res.json().catch(() => null);
        if (!res.ok) {
            setError(data?.error ?? "Unable to update contact status.");
        } else {
            await load();
        }
        setActing(false);
    }

    async function sendReply() {
        if (!selected || !replySubject.trim() || !replyBody.trim()) return;
        setActing(true);
        setError(null);
        const res = await fetch(`/api/organizer/contacts/${selected.id}/reply`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                subject: replySubject,
                body: replyBody,
            }),
        });
        const data = await res.json().catch(() => null);
        if (!res.ok) {
            setError(data?.error ?? "Unable to send reply.");
        } else {
            setReplyBody("");
            await load();
        }
        setActing(false);
    }

    async function deleteContact(id: string) {
        if (!confirm("Delete this contact thread?")) return;
        setActing(true);
        setError(null);
        const res = await fetch(`/api/organizer/contacts/${id}`, { method: "DELETE" });
        const data = await res.json().catch(() => null);
        if (!res.ok) {
            setError(data?.error ?? "Unable to delete contact thread.");
        } else {
            await load();
        }
        setActing(false);
    }

    return (
        <div className="space-y-6">
            <div>
                <h1 className="text-4xl font-black italic tracking-tighter uppercase">CONTACT_INBOX</h1>
                <div className="mt-1 font-mono text-xs text-on-surface-variant">
                    {loading ? "LOADING..." : `${contacts.length} THREADS // ${contacts.filter((contact) => contact.status === "NEW").length} NEW`}
                </div>
            </div>

            {error && (
                <div className="border border-error/20 px-4 py-3 font-mono text-xs text-error">
                    {error}
                </div>
            )}

            <div className="flex gap-2">
                {STATUS_TABS.map((tab) => (
                    <button
                        key={tab}
                        onClick={() => setFilter(tab)}
                        className={`border px-4 py-2 font-mono text-xs tracking-widest uppercase transition-colors ${filter === tab
                            ? "border-[#39FF14] bg-[#39FF14]/5 text-[#39FF14]"
                            : "border-outline-variant/20 text-on-surface-variant hover:border-outline-variant"
                            }`}
                    >
                        {tab}
                    </button>
                ))}
            </div>

            <div className="grid gap-6 xl:grid-cols-[minmax(22rem,0.9fr)_minmax(0,1.4fr)]">
                <div className="space-y-2">
                    {loading ? (
                        <div className="font-mono text-xs text-on-surface-variant animate-pulse">LOADING_THREADS...</div>
                    ) : filtered.length === 0 ? (
                        <div className="border border-outline-variant/20 bg-surface-container-high px-5 py-6 font-mono text-xs text-on-surface-variant">
                            NO_CONTACT_THREADS
                        </div>
                    ) : (
                        filtered.map((contact) => (
                            <button
                                key={contact.id}
                                onClick={() => setSelectedId(contact.id)}
                                className={`w-full border px-5 py-4 text-left transition-colors ${selected?.id === contact.id
                                    ? "border-[#39FF14] bg-[#39FF14]/5"
                                    : "border-outline-variant/10 bg-surface-container-high hover:border-outline-variant/30"
                                    }`}
                            >
                                <div className="flex items-start justify-between gap-3">
                                    <div className="min-w-0">
                                        <div className="truncate font-black uppercase tracking-tight">
                                            {contact.name}
                                        </div>
                                        <div className="mt-1 truncate font-mono text-xs text-on-surface-variant">
                                            {contact.subject}
                                        </div>
                                        <div className="mt-2 truncate font-mono text-[11px] text-on-surface-variant">
                                            {contact.email}
                                        </div>
                                    </div>
                                    <span className={`shrink-0 border px-2 py-1 font-mono text-[10px] tracking-widest ${STATUS_STYLES[contact.status]}`}>
                                        {contact.status}
                                    </span>
                                </div>
                            </button>
                        ))
                    )}
                </div>

                <AnimatePresence mode="wait">
                    {selected ? (
                        <motion.div
                            key={selected.id}
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -10 }}
                            className="space-y-6 border border-outline-variant/20 bg-surface-container-high p-6"
                        >
                            <div className="flex flex-wrap items-start justify-between gap-4">
                                <div>
                                    <div className="font-black uppercase tracking-tight">{selected.name}</div>
                                    <div className="mt-1 font-mono text-xs text-on-surface-variant">{selected.email}</div>
                                    <div className="mt-1 font-mono text-xs text-on-surface-variant">
                                        RECEIVED {new Date(selected.createdAt).toLocaleString()}
                                    </div>
                                </div>
                                <div className="flex flex-wrap gap-2">
                                    {selected.status !== "NEW" && (
                                        <button
                                            onClick={() => updateStatus(selected.id, "NEW")}
                                            disabled={acting}
                                            className="border border-yellow-400/30 px-3 py-2 font-mono text-[10px] tracking-widest text-yellow-300 transition-colors hover:bg-yellow-400/10 disabled:opacity-40"
                                        >
                                            MARK_NEW
                                        </button>
                                    )}
                                    {selected.status !== "ARCHIVED" && (
                                        <button
                                            onClick={() => updateStatus(selected.id, "ARCHIVED")}
                                            disabled={acting}
                                            className="border border-outline-variant/20 px-3 py-2 font-mono text-[10px] tracking-widest text-on-surface-variant transition-colors hover:border-outline-variant disabled:opacity-40"
                                        >
                                            ARCHIVE
                                        </button>
                                    )}
                                    <button
                                        onClick={() => deleteContact(selected.id)}
                                        disabled={acting}
                                        className="border border-error/20 px-3 py-2 font-mono text-[10px] tracking-widest text-error transition-colors hover:bg-error/10 disabled:opacity-40"
                                    >
                                        DELETE
                                    </button>
                                </div>
                            </div>

                            <div>
                                <div className="mb-2 font-mono text-xs tracking-widest text-[#39FF14]">SUBJECT</div>
                                <div className="font-mono text-sm text-on-surface">{selected.subject}</div>
                            </div>

                            <div>
                                <div className="mb-2 font-mono text-xs tracking-widest text-[#39FF14]">MESSAGE</div>
                                <div className="whitespace-pre-wrap font-mono text-sm leading-7 text-on-surface-variant">
                                    {selected.message}
                                </div>
                            </div>

                            <div className="space-y-3">
                                <div className="font-mono text-xs tracking-widest text-[#39FF14]">
                                    REPLY_PORTAL
                                </div>
                                <input
                                    value={replySubject}
                                    onChange={(event) => setReplySubject(event.target.value)}
                                    className="w-full border border-outline-variant/30 bg-surface px-4 py-3 font-mono text-sm text-on-surface focus:border-[#39FF14] focus:outline-none"
                                    placeholder="Reply subject"
                                />
                                <textarea
                                    value={replyBody}
                                    onChange={(event) => setReplyBody(event.target.value)}
                                    rows={8}
                                    className="w-full resize-y border border-outline-variant/30 bg-surface px-4 py-3 font-mono text-sm text-on-surface focus:border-[#39FF14] focus:outline-none"
                                    placeholder="Write your reply..."
                                />
                                <button
                                    onClick={sendReply}
                                    disabled={acting || !replySubject.trim() || !replyBody.trim()}
                                    className="w-full bg-primary-container px-4 py-4 font-mono text-xs font-bold tracking-widest uppercase text-on-primary transition-opacity disabled:opacity-40"
                                >
                                    {acting ? "SENDING..." : "SEND_REPLY"}
                                </button>
                            </div>

                            <div>
                                <div className="mb-3 font-mono text-xs tracking-widest text-[#39FF14]">
                                    RESPONSE_HISTORY ({selected.responses.length})
                                </div>
                                <div className="space-y-3">
                                    {selected.responses.length === 0 ? (
                                        <div className="font-mono text-xs text-on-surface-variant">
                                            NO_REPLIES_SENT_YET
                                        </div>
                                    ) : (
                                        selected.responses.map((response) => (
                                            <div key={response.id} className="border border-outline-variant/20 bg-surface px-4 py-4">
                                                <div className="font-mono text-xs text-on-surface-variant">
                                                    {response.sentByName || response.sentByEmail} // {new Date(response.sentAt).toLocaleString()}
                                                </div>
                                                <div className="mt-2 font-mono text-xs text-[#39FF14]">{response.subject}</div>
                                                <div className="mt-2 whitespace-pre-wrap font-mono text-sm leading-7 text-on-surface-variant">
                                                    {response.body}
                                                </div>
                                            </div>
                                        ))
                                    )}
                                </div>
                            </div>
                        </motion.div>
                    ) : (
                        <div className="border border-outline-variant/20 bg-surface-container-high px-6 py-10 font-mono text-xs text-on-surface-variant">
                            SELECT_A_CONTACT_THREAD
                        </div>
                    )}
                </AnimatePresence>
            </div>
        </div>
    );
}
