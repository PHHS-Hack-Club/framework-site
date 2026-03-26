"use client";

import { useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

const STEPS = ["PERSONAL", "EXPERIENCE", "LOGISTICS", "REVIEW"];

const TSHIRT_SIZES = ["XS", "S", "M", "L", "XL", "XXL"];
const EXPERIENCE_LEVELS = ["intermediate", "advanced"];
const GRADES = ["9th", "10th", "11th", "12th"];

type FormData = {
    school: string; grade: string; github: string;
    experience: string; dietary: string; tshirt: string; shortAnswer: string;
    schoolIdPath: string;
};

const INITIAL: FormData = {
    school: "", grade: "10th", github: "", experience: "intermediate",
    dietary: "", tshirt: "M", shortAnswer: "", schoolIdPath: "",
};

export default function ApplyPage() {
    const [step, setStep] = useState(0);
    const [form, setForm] = useState<FormData>(INITIAL);
    const [loading, setLoading] = useState(false);
    const [err, setErr] = useState<string | null>(null);
    const [done, setDone] = useState(false);

    // School ID upload state
    const [idFile, setIdFile] = useState<File | null>(null);
    const [idPreview, setIdPreview] = useState<string | null>(null);
    const [idUploading, setIdUploading] = useState(false);
    const [idErr, setIdErr] = useState<string | null>(null);
    const fileInputRef = useRef<HTMLInputElement>(null);

    function update(k: keyof FormData, v: string) {
        setForm((p) => ({ ...p, [k]: v }));
    }

    async function handleIdSelect(e: React.ChangeEvent<HTMLInputElement>) {
        const file = e.target.files?.[0];
        if (!file) return;

        setIdErr(null);
        setIdFile(file);
        setIdPreview(URL.createObjectURL(file));
        update("schoolIdPath", "");

        setIdUploading(true);
        try {
            const fd = new FormData();
            fd.append("file", file);
            const res = await fetch("/api/hacker/school-id", { method: "POST", body: fd });
            const data = await res.json();
            if (!res.ok) {
                setIdErr(data.error ?? "Upload failed");
                setIdFile(null);
                setIdPreview(null);
            } else {
                update("schoolIdPath", data.filename);
            }
        } catch {
            setIdErr("Upload failed — check your connection and try again.");
        } finally {
            setIdUploading(false);
        }
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
                <p className="font-mono text-sm text-on-surface-variant">We&apos;ll review your application and notify you via email.</p>
            </div>
        );
    }

    const input = "w-full bg-surface border border-outline-variant/30 px-4 py-3 font-mono text-sm text-on-surface focus:outline-none focus:border-[#39FF14] transition-colors";
    const label = "font-mono text-xs text-on-surface-variant tracking-widest block mb-2 uppercase";

    const step0Valid = !!form.school && !!form.grade && !!form.github;
    const step1Valid = !!form.experience && !!form.shortAnswer;
    const step2Valid = !!form.tshirt && !!form.schoolIdPath;

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
                                <label className={label}>GitHub Username</label>
                                <input className={input} value={form.github} onChange={e => update("github", e.target.value)} placeholder="yourusername" />
                                <div className="mt-2 font-mono text-[11px] text-on-surface-variant">
                                    Required. We want a real handle we can check before event day.
                                </div>
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
                                                {l === "intermediate" ? "You can already build and debug your own projects." : "You have shipped substantial software and can move fast without hand-holding."}
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

                            {/* School ID Upload */}
                            <div>
                                <label className={label}>School ID Photo <span className="text-error">*</span></label>

                                {/* Warning banner */}
                                <div className="mb-4 flex gap-3 items-start p-4 border border-yellow-400/30 bg-yellow-400/5">
                                    <span className="text-yellow-400 font-mono text-lg leading-none mt-0.5">⚠</span>
                                    <p className="font-mono text-xs text-yellow-400 leading-relaxed">
                                        You <strong>must bring your physical school ID on the day of the event</strong>.
                                        No ID, no entry — this is a hard rule, no exceptions.
                                        Upload a clear photo of it now for pre-registration verification.
                                    </p>
                                </div>

                                <input
                                    ref={fileInputRef}
                                    type="file"
                                    accept="image/jpeg,image/png,image/webp,image/heic,image/heif,.heic,.heif"
                                    onChange={handleIdSelect}
                                    className="hidden"
                                />

                                {!idFile ? (
                                    <button
                                        type="button"
                                        onClick={() => fileInputRef.current?.click()}
                                        className="w-full border-2 border-dashed border-outline-variant/40 hover:border-[#39FF14]/50 transition-colors py-10 flex flex-col items-center gap-3 text-on-surface-variant hover:text-on-surface"
                                    >
                                        <span className="font-mono text-3xl">↑</span>
                                        <span className="font-mono text-xs tracking-widest uppercase">SELECT_PHOTO</span>
                                        <span className="font-mono text-[10px] text-on-surface-variant/60">JPEG · PNG · WEBP · HEIC · max 8 MB</span>
                                    </button>
                                ) : (
                                    <div className="space-y-3">
                                        <div className="relative border border-outline-variant/20 overflow-hidden">
                                            {idPreview && (
                                                <img src={idPreview} alt="School ID preview" className="w-full max-h-48 object-contain bg-black/30" />
                                            )}
                                            {idUploading && (
                                                <div className="absolute inset-0 bg-black/60 flex items-center justify-center">
                                                    <span className="font-mono text-xs text-[#39FF14] animate-pulse tracking-widest">UPLOADING...</span>
                                                </div>
                                            )}
                                            {!idUploading && form.schoolIdPath && (
                                                <div className="absolute top-2 right-2 bg-[#39FF14] text-[#053900] font-mono text-[10px] font-bold px-2 py-1 tracking-widest">
                                                    ✓ UPLOADED
                                                </div>
                                            )}
                                        </div>
                                        {idErr && (
                                            <div className="font-mono text-xs text-error">{idErr}</div>
                                        )}
                                        <button
                                            type="button"
                                            onClick={() => { setIdFile(null); setIdPreview(null); update("schoolIdPath", ""); setIdErr(null); if (fileInputRef.current) fileInputRef.current.value = ""; }}
                                            className="font-mono text-xs text-on-surface-variant hover:text-error transition-colors tracking-widest"
                                        >
                                            REMOVE × REUPLOAD
                                        </button>
                                    </div>
                                )}
                            </div>
                        </>
                    )}

                    {step === 3 && (
                        <div className="space-y-4">
                            <div className="bg-surface-container-high p-6 border border-outline-variant/10 space-y-3">
                                {Object.entries({ School: form.school, Grade: form.grade, GitHub: form.github, Experience: form.experience, "T-Shirt": form.tshirt, Dietary: form.dietary || "None" }).map(([k, v]) => (
                                    <div key={k} className="flex justify-between font-mono text-sm">
                                        <span className="text-on-surface-variant">{k}</span>
                                        <span className="text-on-surface font-bold">{v}</span>
                                    </div>
                                ))}
                                <div className="flex justify-between font-mono text-sm">
                                    <span className="text-on-surface-variant">School ID</span>
                                    <span className="text-[#39FF14] font-bold">{form.schoolIdPath ? "✓ UPLOADED" : "MISSING"}</span>
                                </div>
                            </div>
                            <div className="bg-surface-container-high p-6 border border-outline-variant/10">
                                <div className="font-mono text-xs text-on-surface-variant mb-2">SHORT_ANSWER</div>
                                <p className="font-mono text-sm">{form.shortAnswer}</p>
                            </div>
                            <div className="p-4 border border-yellow-400/30 bg-yellow-400/5 font-mono text-xs text-yellow-400 leading-relaxed">
                                ⚠ Remember — you must bring your physical school ID on event day. No ID = no entry.
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
                    <motion.button
                        whileTap={{ scale: 0.98 }}
                        onClick={() => setStep(p => p + 1)}
                        disabled={
                            (step === 0 && !step0Valid) ||
                            (step === 1 && !step1Valid) ||
                            (step === 2 && (!step2Valid || idUploading))
                        }
                        className="flex-1 py-4 bg-surface-container-high border border-outline-variant/30 font-mono text-xs tracking-widest uppercase hover:border-[#39FF14] hover:text-[#39FF14] transition-colors disabled:opacity-50"
                    >
                        {step === 2 && idUploading ? "UPLOADING..." : "NEXT →"}
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
