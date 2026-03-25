"use client";

import { useState } from "react";
import { motion } from "framer-motion";

type EventConfig = {
    themePrompt: string | null;
    themeReleased: boolean;
    projectSubmissionsOpen: boolean;
};

export default function EventControls({ initialConfig }: { initialConfig: EventConfig }) {
    const [themePrompt, setThemePrompt] = useState(initialConfig.themePrompt ?? "");
    const [themeReleased, setThemeReleased] = useState(initialConfig.themeReleased);
    const [projectSubmissionsOpen, setProjectSubmissionsOpen] = useState(initialConfig.projectSubmissionsOpen);
    const [saving, setSaving] = useState(false);
    const [message, setMessage] = useState<string | null>(null);
    const [error, setError] = useState<string | null>(null);

    async function save() {
        setSaving(true);
        setMessage(null);
        setError(null);

        try {
            const response = await fetch("/api/organizer/event-config", {
                method: "PUT",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    themePrompt,
                    themeReleased,
                    projectSubmissionsOpen,
                }),
            });

            const data = await response.json().catch(() => null);
            if (!response.ok) {
                setError(data?.error ?? "Unable to save event controls.");
                return;
            }

            setMessage("Event controls updated.");
        } finally {
            setSaving(false);
        }
    }

    return (
        <div className="space-y-5 border border-[#39FF14]/15 bg-surface-container-high p-6">
            <div>
                <div className="font-mono text-xs tracking-widest text-[#39FF14] uppercase">DAY_OF_CONTROLS</div>
                <h2 className="mt-2 text-2xl font-black italic uppercase tracking-tighter">Theme + Submission Gates</h2>
                <p className="mt-2 max-w-2xl font-mono text-xs leading-6 text-on-surface-variant">
                    Release the theme when you are ready and open the full project flow when teams and submissions should go live.
                </p>
            </div>

            <div className="grid gap-4 md:grid-cols-2">
                <button
                    type="button"
                    onClick={() => setThemeReleased((value) => !value)}
                    className={`border px-4 py-4 text-left font-mono text-xs uppercase tracking-[0.2em] transition-colors ${
                        themeReleased
                            ? "border-[#39FF14] bg-[#39FF14]/8 text-[#39FF14]"
                            : "border-outline-variant/30 text-on-surface-variant hover:border-[#39FF14]/40"
                    }`}
                >
                    THEME_STATUS
                    <div className="mt-2 text-base font-bold tracking-normal">
                        {themeReleased ? "RELEASED" : "HIDDEN"}
                    </div>
                </button>

                <button
                    type="button"
                    onClick={() => setProjectSubmissionsOpen((value) => !value)}
                    className={`border px-4 py-4 text-left font-mono text-xs uppercase tracking-[0.2em] transition-colors ${
                        projectSubmissionsOpen
                            ? "border-[#39FF14] bg-[#39FF14]/8 text-[#39FF14]"
                            : "border-outline-variant/30 text-on-surface-variant hover:border-[#39FF14]/40"
                    }`}
                >
                    PROJECT_FLOW
                    <div className="mt-2 text-base font-bold tracking-normal">
                        {projectSubmissionsOpen ? "OPEN" : "LOCKED"}
                    </div>
                </button>
            </div>

            <div>
                <label className="mb-2 block font-mono text-xs uppercase tracking-[0.2em] text-on-surface-variant">
                    DAY_OF_THEME
                </label>
                <textarea
                    rows={4}
                    value={themePrompt}
                    onChange={(event) => setThemePrompt(event.target.value)}
                    placeholder="e.g. Build software that turns confusion into clarity."
                    className="w-full resize-y border border-outline-variant/30 bg-surface px-4 py-3 font-mono text-sm text-on-surface outline-none transition focus:border-[#39FF14]"
                />
            </div>

            <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                <motion.button
                    whileTap={{ scale: 0.98 }}
                    onClick={save}
                    disabled={saving}
                    className="bg-primary-container px-6 py-3 font-mono text-xs font-bold uppercase tracking-[0.24em] text-on-primary disabled:opacity-50"
                >
                    {saving ? "SAVING..." : "SAVE_CONTROLS"}
                </motion.button>

                <div
                    className={`font-mono text-xs uppercase tracking-[0.18em] ${
                        error ? "text-error" : "text-on-surface-variant"
                    }`}
                >
                    {error ?? message ?? "Theme and project flow stay locked until you open them."}
                </div>
            </div>
        </div>
    );
}
