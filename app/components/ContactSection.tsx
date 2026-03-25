"use client";

import { useRef, useState } from "react";
import { motion, useInView } from "framer-motion";
import { fadeUpLarge as fadeUp, stagger } from "@/app/lib/animations";

type ContactState = {
    name: string;
    email: string;
    subject: string;
    message: string;
};

const INITIAL_STATE: ContactState = {
    name: "",
    email: "",
    subject: "",
    message: "",
};

export default function ContactSection() {
    const ref = useRef(null);
    const inView = useInView(ref, { once: true, margin: "-80px" });
    const [form, setForm] = useState(INITIAL_STATE);
    const [status, setStatus] = useState<"idle" | "submitting" | "success" | "error">("idle");
    const [message, setMessage] = useState("");

    async function onSubmit(event: React.FormEvent<HTMLFormElement>) {
        event.preventDefault();
        setStatus("submitting");
        setMessage("");

        const response = await fetch("/api/contact", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(form),
        });

        const data = await response.json().catch(() => null);

        if (!response.ok) {
            setStatus("error");
            setMessage(data?.error ?? "Unable to send message.");
            return;
        }

        setForm(INITIAL_STATE);
        setStatus("success");
        setMessage("Transmission received. We will reply soon.");
    }

    function updateField<K extends keyof ContactState>(key: K, value: ContactState[K]) {
        setForm((current) => ({ ...current, [key]: value }));
    }

    return (
        <section
            id="contact"
            ref={ref}
            className="relative overflow-hidden border-t border-[#39FF14]/10 bg-[#0c0d0c] px-6 py-28 md:px-10"
        >
            <div
                className="absolute inset-0 opacity-20"
                style={{
                    backgroundImage: "radial-gradient(#3c4b35 1px, transparent 1px)",
                    backgroundSize: "26px 26px",
                }}
            />
            <div className="absolute inset-0 bg-[linear-gradient(135deg,rgba(57,255,20,0.14),transparent_35%,transparent_65%,rgba(57,255,20,0.08))]" />
            <motion.div
                animate={{ opacity: [0.18, 0.34, 0.18], x: [0, 18, 0], y: [0, -14, 0] }}
                transition={{ duration: 9, repeat: Infinity, ease: "easeInOut" }}
                className="pointer-events-none absolute -left-16 top-12 h-48 w-48 rounded-full bg-[radial-gradient(circle,rgba(57,255,20,0.14),transparent_70%)] blur-3xl"
            />
            <motion.div
                animate={{ opacity: [0.1, 0.22, 0.1], x: [0, -22, 0], y: [0, 20, 0] }}
                transition={{ duration: 11, repeat: Infinity, ease: "easeInOut" }}
                className="pointer-events-none absolute bottom-8 right-0 h-64 w-64 rounded-full bg-[radial-gradient(circle,rgba(57,255,20,0.12),transparent_72%)] blur-3xl"
            />

            <motion.div
                variants={stagger}
                initial="hidden"
                animate={inView ? "show" : "hidden"}
                className="relative z-10 mx-auto grid max-w-6xl gap-14 lg:grid-cols-[0.95fr_1.05fr]"
            >
                <div className="space-y-8">
                    <motion.p
                        variants={fadeUp}
                        className="font-mono text-xs uppercase tracking-[0.35em] text-[#39FF14]"
                    >
                        contact uplink
                    </motion.p>
                    <motion.h2
                        variants={fadeUp}
                        className="max-w-xl text-5xl font-black uppercase tracking-tight md:text-7xl"
                    >
                        SEND_A_SIGNAL.
                    </motion.h2>
                    <motion.p
                        variants={fadeUp}
                        className="max-w-lg font-mono text-sm leading-7 text-on-surface-variant"
                    >
                        Questions, sponsorship, logistics, judge interest, venue access, or anything
                        else that needs a human. This form routes directly to the organizers.
                    </motion.p>

                    <motion.div
                        variants={fadeUp}
                        className="grid gap-4 border border-[#39FF14]/15 bg-black/30 p-5 font-mono text-xs uppercase tracking-[0.22em] text-on-surface-variant md:grid-cols-2"
                    >
                        <motion.div
                            whileHover={{ y: -4, borderColor: "rgba(57,255,20,0.3)" }}
                            className="border border-[#39FF14]/10 bg-[#111211] p-4"
                        >
                            <div className="mb-2 text-[#39FF14]">Primary Inbox</div>
                            <div className="break-all text-[11px] normal-case tracking-normal text-on-surface">
                                alexradu@phhshack.club
                            </div>
                        </motion.div>
                        <motion.div
                            whileHover={{ y: -4, borderColor: "rgba(57,255,20,0.3)" }}
                            className="border border-[#39FF14]/10 bg-[#111211] p-4"
                        >
                            <div className="mb-2 text-[#39FF14]">Backup Copy</div>
                            <div className="break-all text-[11px] normal-case tracking-normal text-on-surface">
                                al3x.radu1@gmail.com
                            </div>
                        </motion.div>
                    </motion.div>
                </div>

                <motion.form
                    variants={fadeUp}
                    onSubmit={onSubmit}
                    whileHover={{ y: -4 }}
                    className="panel-sheen space-y-5 border border-[#39FF14]/15 bg-[#101110]/90 p-6 shadow-[0_0_60px_rgba(57,255,20,0.08)] backdrop-blur"
                >
                    <div className="grid gap-5 md:grid-cols-2">
                        <label className="flex flex-col gap-2">
                            <span className="font-mono text-[11px] uppercase tracking-[0.24em] text-on-surface-variant">
                                Name
                            </span>
                            <input
                                required
                                value={form.name}
                                onChange={(event) => updateField("name", event.target.value)}
                                className="border border-[#39FF14]/15 bg-[#080908] px-4 py-3 text-sm text-on-surface outline-none transition focus:border-[#39FF14]"
                            />
                        </label>
                        <label className="flex flex-col gap-2">
                            <span className="font-mono text-[11px] uppercase tracking-[0.24em] text-on-surface-variant">
                                Email
                            </span>
                            <input
                                required
                                type="email"
                                value={form.email}
                                onChange={(event) => updateField("email", event.target.value)}
                                className="border border-[#39FF14]/15 bg-[#080908] px-4 py-3 text-sm text-on-surface outline-none transition focus:border-[#39FF14]"
                            />
                        </label>
                    </div>

                    <label className="flex flex-col gap-2">
                        <span className="font-mono text-[11px] uppercase tracking-[0.24em] text-on-surface-variant">
                            Subject
                        </span>
                        <input
                            required
                            value={form.subject}
                            onChange={(event) => updateField("subject", event.target.value)}
                            className="border border-[#39FF14]/15 bg-[#080908] px-4 py-3 text-sm text-on-surface outline-none transition focus:border-[#39FF14]"
                        />
                    </label>

                    <label className="flex flex-col gap-2">
                        <span className="font-mono text-[11px] uppercase tracking-[0.24em] text-on-surface-variant">
                            Message
                        </span>
                        <textarea
                            required
                            rows={7}
                            value={form.message}
                            onChange={(event) => updateField("message", event.target.value)}
                            className="resize-y border border-[#39FF14]/15 bg-[#080908] px-4 py-3 text-sm leading-7 text-on-surface outline-none transition focus:border-[#39FF14]"
                        />
                    </label>

                    <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                        <button
                            type="submit"
                            disabled={status === "submitting"}
                            className="bg-[#39FF14] px-8 py-4 font-mono text-xs font-bold uppercase tracking-[0.28em] text-[#053900] transition hover:-translate-y-0.5 hover:shadow-[0_0_40px_rgba(57,255,20,0.35)] disabled:cursor-not-allowed disabled:opacity-60"
                        >
                            {status === "submitting" ? "TRANSMITTING..." : "SEND_MESSAGE"}
                        </button>

                        <div
                            className={`font-mono text-xs uppercase tracking-[0.2em] ${
                                status === "error" ? "text-[#ffb4ab]" : "text-on-surface-variant"
                            }`}
                        >
                            {message || "Replies go back to the email you enter above."}
                        </div>
                    </div>
                </motion.form>
            </motion.div>
        </section>
    );
}
