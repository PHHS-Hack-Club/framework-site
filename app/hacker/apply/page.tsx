"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";

const STEPS = ["PERSONAL", "EXPERIENCE", "LOGISTICS", "REVIEW"];

const TSHIRT_SIZES = ["XS", "S", "M", "L", "XL", "XXL"];
const EXPERIENCE_LEVELS = ["beginner", "intermediate", "advanced"];
const GRADES = ["9th", "10th", "11th", "12th"];

type FormData = {
    school: string; grade: string; github: string;
    experience: string; dietary: string; tshirt: string; shortAnswer: string;
};

const INITIAL: FormData = {
    school: "", grade: "10th", github: "", experience: "beginner",
    dietary: "", tshirt: "M", shortAnswer: "",
};

export default function ApplyPage() {
    const router = useRouter();
    const [step, setStep] = useState(0);
    const [form, setForm] = useState<FormData>(INITIAL);
    const [loading, setLoading] = useState(false);
    const [err, setErr] = useState<string | null>(null);
    const [done, setDone] = useState(false);

    function update(k: keyof FormData, v: string) {
        setForm((p) => ({ ...p, [k]: v }));
    }

    async function submit() {
        setLoading(true); setErr(null);
        try {
            const res = await fetch("/api/hacker/apply", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(form),
            });
            const data = await res.json();
            if (!res.ok) { setErr(data.error); return; }
            setDone(true);
        } finally {
            setLoading(false);
        }
    }

    if (done) {
        return (
            <div className="flex flex-col items-center justify-center min-h-[60vh] text-center">
                <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} className="text-[#39FF14] text-8xl mb-6">✓</motion.div>
                <h2 className="text-3xl font-black italic tracking-tighter uppercase mb-3">APPLICATION_SUBMITTED</h2>
                <p className="font-mono text-sm text-on-surface-variant">We'll review your application and notify you via email.</p>
            </div>
        );
    }

    const input = "w-full bg-surface border border-outline-variant/30 px-4 py-3 font-mono text-sm text-on-surface focus:outline-none focus:border-[#39FF14] transition-colors";
    const label = "font-mono text-xs text-on-surface-variant tracking-widest block mb-2 uppercase";

    return (
        <div className="max-w-2xl">
            <h1 className="text-4xl font-black italic tracking-tighter uppercase mb-2">APPLICATION</h1>

            {/* Step indicator */}
            <div className="flex gap-2 mb-10">
                {STEPS.map((s, i) => (
                    <div key={s} className={`flex-1 h-1 transition-colors ${i <= step ? "bg-[#39FF14]" : "bg-surface-container-high"}`} />
                ))}
            </div>

            <div className="font-mono text-xs text-[#39FF14] tracking-widest mb-6">{`STEP ${step + 1}/${STEPS.length} :: ${STEPS[step]}`}</div>

            {err && <div className="mb-6 p-3 border-l-4 border-error font-mono text-xs text-error">{err}</div>}

            <AnimatePresence mode="wait">
                <motion.div key={step} initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="space-y-6">
                    {step === 0 && (
                        <>
                            <div>
                                <label className={label}>School Name</label>
                                <input className={input} value={form.school} onChange={e => update("school", e.target.value)} placeholder="Pascack Hills High School" />
                            </div>
                            <div>
                                <label className={label}>Grade</label>
                                <div className="flex gap-3">
                                    {GRADES.map(g => (
                                        <button key={g} onClick={() => update("grade", g)} className={`flex-1 py-3 font-mono text-xs border transition-colors ${form.grade === g ? "border-[#39FF14] text-[#39FF14] bg-[#39FF14]/5" : "border-outline-variant/30 text-on-surface-variant hover:border-outline-variant"}`}>{g}</button>
                                    ))}
                                </div>
                            </div>
                            <div>
                                <label className={label}>GitHub Username (optional)</label>
                                <input className={input} value={form.github} onChange={e => update("github", e.target.value)} placeholder="github.com/yourusername" />
                            </div>
                        </>
                    )}

                    {step === 1 && (
                        <>
                            <div>
                                <label className={label}>Experience Level</label>
                                <div className="space-y-3">
                                    {EXPERIENCE_LEVELS.map(l => (
                                        <button key={l} onClick={() => update("experience", l)} className={`w-full text-left px-4 py-4 border font-mono text-sm transition-colors ${form.experience === l ? "border-[#39FF14] text-[#39FF14] bg-[#39FF14]/5" : "border-outline-variant/30 text-on-surface-variant hover:border-outline-variant"}`}>
                                            <span className="uppercase font-bold">{l}</span>
                                            <span className="block text-xs mt-1 opacity-60">
                                                {l === "beginner" ? "New to coding or less than 1 year experience" : l === "intermediate" ? "1-3 years, completed some personal projects" : "3+ years, shipped production software"}
                                            </span>
                                        </button>
                                    ))}
                                </div>
                            </div>
                            <div>
                                <label className={label}>Short Answer (max 500 chars)</label>
                                <textarea className={`${input} resize-none`} rows={5} maxLength={500} value={form.shortAnswer} onChange={e => update("shortAnswer", e.target.value)} placeholder="What do you want to build at Framework 2027?" />
                                <div className="text-right font-mono text-xs text-on-surface-variant mt-1">{form.shortAnswer.length}/500</div>
                            </div>
                        </>
                    )}

                    {step === 2 && (
                        <>
                            <div>
                                <label className={label}>T-Shirt Size</label>
                                <div className="flex gap-3">
                                    {TSHIRT_SIZES.map(s => (
                                        <button key={s} onClick={() => update("tshirt", s)} className={`flex-1 py-3 font-mono text-xs border transition-colors ${form.tshirt === s ? "border-[#39FF14] text-[#39FF14] bg-[#39FF14]/5" : "border-outline-variant/30 text-on-surface-variant hover:border-outline-variant"}`}>{s}</button>
                                    ))}
                                </div>
                            </div>
                            <div>
                                <label className={label}>Dietary Restrictions (optional)</label>
                                <input className={input} value={form.dietary} onChange={e => update("dietary", e.target.value)} placeholder="Vegetarian, Vegan, Gluten-free, Nut allergy..." />
                            </div>
                        </>
                    )}

                    {step === 3 && (
                        <div className="space-y-4">
                            <div className="bg-surface-container-high p-6 border border-outline-variant/10 space-y-3">
                                {Object.entries({ School: form.school, Grade: form.grade, GitHub: form.github || "—", Experience: form.experience, "T-Shirt": form.tshirt, Dietary: form.dietary || "None" }).map(([k, v]) => (
                                    <div key={k} className="flex justify-between font-mono text-sm">
                                        <span className="text-on-surface-variant">{k}</span>
                                        <span className="text-on-surface font-bold">{v}</span>
                                    </div>
                                ))}
                            </div>
                            <div className="bg-surface-container-high p-6 border border-outline-variant/10">
                                <div className="font-mono text-xs text-on-surface-variant mb-2">SHORT_ANSWER</div>
                                <p className="font-mono text-sm">{form.shortAnswer}</p>
                            </div>
                        </div>
                    )}
                </motion.div>
            </AnimatePresence>

            {/* Nav buttons */}
            <div className="flex gap-4 mt-10">
                {step > 0 && (
                    <button onClick={() => setStep(p => p - 1)} className="flex-1 py-4 border border-outline-variant/30 font-mono text-xs tracking-widest uppercase hover:border-on-surface-variant transition-colors">
                        ← BACK
                    </button>
                )}
                {step < STEPS.length - 1 ? (
                    <motion.button whileTap={{ scale: 0.98 }} onClick={() => setStep(p => p + 1)} className="flex-1 py-4 bg-surface-container-high border border-outline-variant/30 font-mono text-xs tracking-widest uppercase hover:border-[#39FF14] hover:text-[#39FF14] transition-colors">
                        NEXT →
                    </motion.button>
                ) : (
                    <motion.button whileTap={{ scale: 0.98 }} onClick={submit} disabled={loading} className="flex-1 py-4 bg-primary-container text-on-primary font-mono text-xs tracking-widest uppercase font-bold disabled:opacity-50 glow-breathe">
                        {loading ? "SUBMITTING..." : "SUBMIT_APPLICATION_"}
                    </motion.button>
                )}
            </div>
        </div>
    );
}
