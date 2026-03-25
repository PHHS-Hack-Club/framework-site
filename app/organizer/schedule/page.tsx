"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";

type Event = { id: string; title: string; location: string | null; day: number; startTime: string; endTime: string | null; tag: string | null };

const TAGS = ["", "LIVE", "WORKSHOP", "MEAL", "BREAK", "CEREMONY"];

export default function SchedulePage() {
    const [events, setEvents] = useState<Event[]>([]);
    const [loading, setLoading] = useState(true);
    const [form, setForm] = useState({ title: "", location: "", day: 1, startTime: "09:00", endTime: "", tag: "" });
    const [editId, setEditId] = useState<string | null>(null);
    const [saving, setSaving] = useState(false);

    async function load() {
        const r = await fetch("/api/organizer/schedule");
        if (r.ok) setEvents(await r.json());
        setLoading(false);
    }
    useEffect(() => { load(); }, []);

    function startEdit(ev: Event) {
        setEditId(ev.id);
        setForm({ title: ev.title, location: ev.location ?? "", day: ev.day, startTime: ev.startTime, endTime: ev.endTime ?? "", tag: ev.tag ?? "" });
    }
    function reset() { setEditId(null); setForm({ title: "", location: "", day: 1, startTime: "09:00", endTime: "", tag: "" }); }

    async function save() {
        setSaving(true);
        const method = editId ? "PUT" : "POST";
        const url = editId ? `/api/organizer/schedule/${editId}` : "/api/organizer/schedule";
        const r = await fetch(url, { method, headers: { "Content-Type": "application/json" }, body: JSON.stringify(form) });
        if (r.ok) { await load(); reset(); }
        setSaving(false);
    }

    async function del(id: string) {
        await fetch(`/api/organizer/schedule/${id}`, { method: "DELETE" });
        await load();
    }

    const input = "w-full bg-surface-container-lowest border border-outline-variant/30 px-3 py-2 font-mono text-sm text-on-surface focus:outline-none focus:border-[#39FF14] transition-colors";

    const day1 = events.filter(e => e.day === 1).sort((a, b) => a.startTime.localeCompare(b.startTime));
    const day2 = events.filter(e => e.day === 2).sort((a, b) => a.startTime.localeCompare(b.startTime));

    return (
        <div className="space-y-8">
            <h1 className="text-4xl font-black italic tracking-tighter uppercase">SCHEDULE_MANAGER</h1>

            {/* Form */}
            <div className="bg-surface-container-high p-6 border border-outline-variant/10">
                <div className="font-mono text-xs text-[#39FF14] tracking-widest mb-4">{editId ? "EDIT_EVENT" : "ADD_EVENT"}</div>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                    <div className="col-span-2">
                        <label className="font-mono text-xs text-on-surface-variant tracking-widest block mb-1">TITLE</label>
                        <input className={input} value={form.title} onChange={e => setForm(p => ({ ...p, title: e.target.value }))} placeholder="Opening Ceremony" />
                    </div>
                    <div>
                        <label className="font-mono text-xs text-on-surface-variant tracking-widest block mb-1">DAY</label>
                        <select className={input} value={form.day} onChange={e => setForm(p => ({ ...p, day: parseInt(e.target.value) }))}>
                            <option value={1}>Day 1</option><option value={2}>Day 2</option>
                        </select>
                    </div>
                    <div>
                        <label className="font-mono text-xs text-on-surface-variant tracking-widest block mb-1">START</label>
                        <input type="time" className={input} value={form.startTime} onChange={e => setForm(p => ({ ...p, startTime: e.target.value }))} />
                    </div>
                    <div>
                        <label className="font-mono text-xs text-on-surface-variant tracking-widest block mb-1">END (optional)</label>
                        <input type="time" className={input} value={form.endTime} onChange={e => setForm(p => ({ ...p, endTime: e.target.value }))} />
                    </div>
                    <div>
                        <label className="font-mono text-xs text-on-surface-variant tracking-widest block mb-1">TAG</label>
                        <select className={input} value={form.tag} onChange={e => setForm(p => ({ ...p, tag: e.target.value }))}>
                            {TAGS.map(t => <option key={t} value={t}>{t || "None"}</option>)}
                        </select>
                    </div>
                    <div className="col-span-2">
                        <label className="font-mono text-xs text-on-surface-variant tracking-widest block mb-1">LOCATION</label>
                        <input className={input} value={form.location} onChange={e => setForm(p => ({ ...p, location: e.target.value }))} placeholder="Auditorium" />
                    </div>
                </div>
                <div className="flex gap-3 mt-4">
                    <motion.button whileTap={{ scale: 0.98 }} onClick={save} disabled={saving || !form.title}
                        className="px-6 py-3 bg-primary-container text-on-primary font-mono text-xs tracking-widest uppercase font-bold disabled:opacity-50">
                        {saving ? "SAVING..." : editId ? "UPDATE_" : "ADD_EVENT_"}
                    </motion.button>
                    {editId && <button onClick={reset} className="px-6 py-3 border border-outline-variant/30 font-mono text-xs text-on-surface-variant hover:border-outline-variant transition-colors">CANCEL</button>}
                </div>
            </div>

            {/* Schedule display */}
            {[{ day: 1, evs: day1 }, { day: 2, evs: day2 }].map(({ day, evs }) => (
                <div key={day}>
                    <div className="font-mono text-xs text-[#39FF14] tracking-widest mb-3">DAY_0{day}</div>
                    {loading ? <div className="font-mono text-xs text-on-surface-variant animate-pulse">LOADING...</div> : evs.length === 0 ? (
                        <div className="font-mono text-xs text-on-surface-variant">No events yet.</div>
                    ) : (
                        <div className="space-y-0">
                            {evs.map(ev => (
                                <div key={ev.id} className="flex items-center justify-between p-4 border-b border-outline-variant/10 bg-surface-container-high hover:bg-surface-container group">
                                    <div className="flex items-center gap-4">
                                        <span className="font-mono text-[#39FF14] w-12">{ev.startTime}</span>
                                        <span className="font-bold uppercase tracking-tight">{ev.title}</span>
                                        {ev.tag && <span className="font-mono text-xs border border-[#39FF14]/30 text-[#39FF14] px-2 py-0.5">{ev.tag}</span>}
                                        {ev.location && <span className="font-mono text-xs text-on-surface-variant hidden md:block">{ev.location}</span>}
                                    </div>
                                    <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                        <button onClick={() => startEdit(ev)} className="font-mono text-xs text-on-surface-variant hover:text-[#39FF14] transition-colors px-2">EDIT</button>
                                        <button onClick={() => del(ev.id)} className="font-mono text-xs text-on-surface-variant hover:text-error transition-colors px-2">DEL</button>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            ))}
        </div>
    );
}
