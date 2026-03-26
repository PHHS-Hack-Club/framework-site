"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Navbar from "@/app/components/Navbar";

const SECTIONS = ["GENERAL", "AI_USAGE", "SUBMISSION", "JUDGING"] as const;
type Section = (typeof SECTIONS)[number];

function SectionLabel({ children }: { children: React.ReactNode }) {
    return (
        <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5 }}
            className="mb-6 font-mono text-[10px] tracking-[0.35em] text-[#39FF14] uppercase"
        >
            {children}
        </motion.div>
    );
}

function Rule({ index, title, body, delay = 0 }: { index: string; title: string; body: string; delay?: number }) {
    return (
        <motion.div
            initial={{ opacity: 0, y: 16, filter: "blur(4px)" }}
            animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
            transition={{ delay, duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
            whileHover={{ x: 6, borderColor: "rgba(57,255,20,0.6)" }}
            className="border-l-2 border-[#39FF14]/20 pl-5 py-1 transition-colors"
        >
            <div className="font-mono text-[10px] text-on-surface-variant mb-1 tracking-widest">{index}</div>
            <div className="font-mono text-sm font-bold text-on-surface uppercase tracking-wide mb-1">{title}</div>
            <div className="font-mono text-sm text-on-surface-variant leading-relaxed">{body}</div>
        </motion.div>
    );
}

function Tag({ children, variant = "default" }: { children: React.ReactNode; variant?: "good" | "bad" | "default" }) {
    const colors = {
        good: "border-[#39FF14]/30 text-[#39FF14]",
        bad: "border-[#ffb4ab]/30 text-[#ffb4ab]",
        default: "border-outline-variant text-on-surface-variant",
    };
    return (
        <motion.span
            whileHover={{ scale: 1.08, y: -2 }}
            className={`font-mono text-[10px] uppercase tracking-[0.18em] border px-2 py-1 ${colors[variant]}`}
        >
            {children}
        </motion.span>
    );
}

function GeneralSection() {
    return (
        <div className="space-y-12">
            <div>
                <SectionLabel>// ELIGIBILITY</SectionLabel>
                <div className="space-y-6">
                    <Rule index="G-01" title="Bergen County Students Only"
                        body="Open to high school students who reside in or attend school within Bergen County, NJ. College students, graduates, and non-Bergen County participants are not eligible." />
                    <Rule index="G-02" title="Prior Coding Experience Required"
                        body="This event assumes you already know how to write and ship code. There is no beginner track. If you're still learning the fundamentals, come back when you've built something on your own." />
                    <Rule index="G-03" title="Physical School ID Required"
                        body="You must bring a valid, physical school ID on the day of the event. There are no exceptions and no workarounds. Upload a photo during your application for pre-verification." />
                </div>
            </div>
            <div>
                <SectionLabel>// FORMAT</SectionLabel>
                <div className="space-y-6">
                    <Rule index="G-04" title="Same-Day Build Only"
                        body="Framework 2027 is a single-day event. All work must be built on event day after the theme is revealed. Pre-building or committing substantial code before the theme drops is a disqualification." />
                    <Rule index="G-05" title="Software Projects Only"
                        body="No hardware, no physical fabrication, no device labs. Your submission must be a software project that runs on a standard computer without special external hardware." />
                    <Rule index="G-06" title="Team Size: 1–4 Members"
                        body="Teams can be solo or up to 4 members. Teams form on event day inside the project flow — there is no pre-registration for teams. You lock in teammates on-site after the theme drops." />
                    <Rule index="G-07" title="One Project Per Team"
                        body="Each team submits exactly one project. Members may not split across multiple submissions." />
                </div>
            </div>
            <div>
                <SectionLabel>// CONDUCT</SectionLabel>
                <div className="space-y-6">
                    <Rule index="G-08" title="Respect the Space"
                        body="Pascack Hills High School is hosting this event. Treat the building, equipment, and staff with respect. Damage to school property is your personal liability." />
                    <Rule index="G-09" title="No Harassment"
                        body="Any form of harassment, discrimination, or threatening behavior results in immediate removal from the event with no refund or recourse." />
                    <Rule index="G-10" title="Organizer Decisions Are Final"
                        body="Organizers have final say on eligibility disputes, rule interpretations, and disqualification decisions. Arguing with organizers on event day is grounds for removal." />
                </div>
            </div>
        </div>
    );
}

function AIUsageSection() {
    return (
        <div className="space-y-12">
            <div className="border border-[#39FF14]/20 bg-[#39FF14]/5 p-5 font-mono text-sm text-on-surface-variant leading-relaxed">
                <span className="text-[#39FF14] font-bold">TLDR: </span>
                AI tools are allowed. If you use them, disclose it and be able to explain what they produced. Submitting work you cannot explain is grounds for disqualification.
            </div>

            <div>
                <SectionLabel>// DEFINITIONS</SectionLabel>
                <div className="space-y-4">
                    {[
                        ["AI Tools", "Chat assistants, code assistants, image/audio generators, auto-debuggers (ChatGPT, Claude, Cursor, Copilot, etc.)"],
                        ["Vibe Coding", "Generating large portions of code through AI prompts without meaningful understanding of what was produced."],
                        ["External Code", "Code copied from the internet, templates, or repositories — AI-generated or not."],
                    ].map(([term, def]) => (
                        <div key={term} className="flex gap-4">
                            <span className="font-mono text-xs text-[#39FF14] uppercase tracking-widest shrink-0 pt-0.5 w-32">{term}</span>
                            <span className="font-mono text-sm text-on-surface-variant leading-relaxed">{def}</span>
                        </div>
                    ))}
                </div>
            </div>

            <div>
                <SectionLabel>// ALLOWED USES</SectionLabel>
                <div className="flex flex-wrap gap-2 mb-4">
                    {["Brainstorming ideas", "Learning concepts", "Debug assistance", "Refactoring your code", "Writing docs / README", "Adding comments and tests"].map(t => (
                        <Tag key={t} variant="good">{t}</Tag>
                    ))}
                </div>
                <p className="font-mono text-sm text-on-surface-variant leading-relaxed">
                    These uses support your learning and authorship. Using AI to understand a concept, interpret an error, or clean up code you wrote is fine — and encouraged.
                </p>
            </div>

            <div>
                <SectionLabel>// DISALLOWED USES</SectionLabel>
                <div className="flex flex-wrap gap-2 mb-4">
                    {["End-to-end generation", "Unexplainable submissions", "Undisclosed AI use", "Cloning existing projects", "Feeding in private data"].map(t => (
                        <Tag key={t} variant="bad">{t}</Tag>
                    ))}
                </div>
                <div className="space-y-4">
                    <Rule index="AI-01" title="Submitting Work You Cannot Explain"
                        body="If a judge asks how something works and you cannot explain it, that portion of your project is considered invalid. This applies whether AI wrote it or you copied it." />
                    <Rule index="AI-02" title="Generating the Entire Project"
                        body="Using AI to generate a complete project end-to-end with no meaningful authorship is disqualification. The code should reflect your decisions, not just your prompts." />
                    <Rule index="AI-03" title="Cloning an Existing Project"
                        body="Submitting a copied GitHub repo, template, or fully AI-generated project as your original work is plagiarism and will be disqualified." />
                    <Rule index="AI-04" title="Feeding in Private or Sensitive Data"
                        body="Do not paste student information, passwords, API keys, or any private data into AI tools. This is a safety violation regardless of the project context." />
                </div>
            </div>

            <div>
                <SectionLabel>// DISCLOSURE REQUIREMENTS</SectionLabel>
                <p className="font-mono text-sm text-on-surface-variant leading-relaxed mb-6">
                    If you used any AI tools during the event, your submission must include a disclosure. Judges use this to calibrate evaluation — AI usage is not a disqualifier, but hiding it is.
                </p>
                <div className="space-y-3 border border-outline-variant/20 bg-surface-container-high p-5">
                    {[
                        "Which tools you used (e.g., ChatGPT, Claude Code, Cursor)",
                        "What you used them for — idea, debug, UI, backend, etc.",
                        "1–2 concrete examples: \"AI suggested X; we changed it to Y because...\"",
                        "What you learned or how it changed your approach",
                        "Known limitations or risks in the AI-assisted code",
                    ].map((item, i) => (
                        <div key={i} className="flex gap-3 font-mono text-sm text-on-surface-variant">
                            <span className="text-[#39FF14] shrink-0">›</span>
                            <span>{item}</span>
                        </div>
                    ))}
                </div>
            </div>

            <div>
                <SectionLabel>// AI DEBUGGING GUIDE</SectionLabel>
                <p className="font-mono text-sm text-on-surface-variant leading-relaxed mb-6">
                    AI is a useful debugging partner when it supports your thinking rather than replacing it. Use it to understand errors — not to make them disappear.
                </p>
                <div className="space-y-6">
                    <Rule index="AI-D1" title="Understand the Error First"
                        body='Read the error message before asking AI anything. Identify where it occurs and what you expected vs. what happened. Good prompt: "I get this error on line 42: [error]. What does it mean?" Bad prompt: "Fix my code."' />
                    <Rule index="AI-D2" title="Ask for Explanations, Not Just Fixes"
                        body='"Why is this happening?" gets you more than "fix this." Ask for possible causes, ways to test which cause is correct, and an explanation of the unexpected behavior.' />
                    <Rule index="AI-D3" title="Test Every Suggestion"
                        body="AI suggestions may be wrong, incomplete, or subtly broken. Before accepting a fix: run it, check edge cases, understand the change. If you cannot explain why a fix works, keep investigating." />
                </div>
            </div>
        </div>
    );
}

function SubmissionSection() {
    return (
        <div className="space-y-12">
            <div>
                <SectionLabel>// REQUIREMENTS</SectionLabel>
                <div className="space-y-6">
                    <Rule index="S-01" title="Submit Before the Freeze"
                        body="The submission window closes at 17:00 on event day. No late submissions will be accepted under any circumstances — the freeze is enforced by the platform." />
                    <Rule index="S-02" title="Working Demo Required"
                        body="Your project must run and be demonstrable to judges. A broken build or an untestable submission will not be evaluated. Have a fallback demo ready if live infra is shaky." />
                    <Rule index="S-03" title="Source Code Required"
                        body="You must submit a link to your source code (GitHub or equivalent). Judges will read your code — make sure it's the real thing, not a cleanup pushed after the freeze." />
                    <Rule index="S-04" title="Built on Event Day"
                        body="All significant code must be written after the theme is revealed. Reusing personal utility libraries is acceptable — submitting a mostly pre-built project is not." />
                </div>
            </div>
            <div>
                <SectionLabel>// WHAT TO INCLUDE</SectionLabel>
                <div className="space-y-3 border border-outline-variant/20 bg-surface-container-high p-5">
                    {[
                        "Project name and one-line description",
                        "Link to live demo or video walkthrough",
                        "Link to source code repository",
                        "Tech stack used",
                        "What the theme prompt meant to your team and how you interpreted it",
                        "AI usage disclosure (if applicable)",
                        "Known bugs or limitations",
                    ].map((item, i) => (
                        <div key={i} className="flex gap-3 font-mono text-sm text-on-surface-variant">
                            <span className="text-[#39FF14] shrink-0">›</span>
                            <span>{item}</span>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}

function JudgingSection() {
    return (
        <div className="space-y-12">
            <div>
                <SectionLabel>// CRITERIA</SectionLabel>
                <div className="space-y-6">
                    <Rule index="J-01" title="Execution Quality"
                        body="Does it work? Is the code thoughtful? Judges evaluate whether the project runs reliably, handles edge cases, and reflects genuine engineering effort — not just a quick scaffold." />
                    <Rule index="J-02" title="Technical Depth"
                        body="How hard was it to build? Projects that solve genuinely difficult technical problems are rewarded over those that repackage simple ideas with polish." />
                    <Rule index="J-03" title="Fit to Theme"
                        body="How well does the project interpret and respond to the revealed theme? Creative, unexpected interpretations score as well as literal ones — judges are looking for intention." />
                    <Rule index="J-04" title="Explainability"
                        body="Judges will ask you to walk through your code. You must be able to explain architectural decisions, why you chose your approach, and how specific components work." />
                    <Rule index="J-05" title="What You Learned"
                        body="Especially relevant when AI tools were used. Judges want to see that the project pushed you technically — not just that you produced output." />
                </div>
            </div>
            <div>
                <SectionLabel>// NOTES</SectionLabel>
                <div className="space-y-6">
                    <Rule index="J-06" title="AI-Assisted Projects"
                        body="An AI-assisted project can win. But it must clear a higher bar on explanation and testing, especially for technical awards. If you used AI heavily, your explanation needs to be proportionally stronger." />
                    <Rule index="J-07" title="Judging Happens Same-Day"
                        body="Project judging begins at 17:30 and results are announced at the closing ceremony around 18:30. All team members should be present for judging." />
                    <Rule index="J-08" title="Organizer Decisions Are Final"
                        body="Prize allocations and placement decisions made by judges are final. Disputes should be raised with organizers before the closing ceremony." />
                </div>
            </div>
        </div>
    );
}

const SECTION_CONTENT: Record<Section, React.ReactNode> = {
    GENERAL: <GeneralSection />,
    AI_USAGE: <AIUsageSection />,
    SUBMISSION: <SubmissionSection />,
    JUDGING: <JudgingSection />,
};

export default function RulesPage() {
    const [active, setActive] = useState<Section>("GENERAL");

    return (
        <div className="min-h-screen bg-background">
            <Navbar dashboardHref={null} />

            <div className="max-w-5xl mx-auto px-6 md:px-12 pt-28 pb-16">
                {/* Title */}
                <motion.div
                    initial={{ opacity: 0, y: 30, filter: "blur(10px)" }}
                    animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
                    transition={{ delay: 0.1, duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
                    className="mb-12"
                >
                    <div className="font-mono text-[10px] tracking-[0.35em] text-[#39FF14] uppercase mb-4">// FRAMEWORK 2027</div>
                    <h1 className="font-headline font-black uppercase italic text-5xl md:text-7xl leading-none mb-4">
                        RULES_INDEX
                    </h1>
                    <motion.div
                        initial={{ scaleX: 0 }}
                        animate={{ scaleX: 1 }}
                        transition={{ delay: 0.5, duration: 0.8 }}
                        style={{ originX: 0 }}
                        className="h-[2px] w-24 bg-gradient-to-r from-[#39FF14] to-transparent"
                    />
                </motion.div>

                {/* Tab nav */}
                <motion.div
                    initial={{ opacity: 0, y: 16 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.3, duration: 0.5 }}
                    className="flex flex-wrap gap-0 border border-[#39FF14]/15 mb-12 overflow-hidden"
                >
                    {SECTIONS.map((s, i) => (
                        <motion.button
                            key={s}
                            onClick={() => setActive(s)}
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            transition={{ delay: 0.4 + i * 0.08 }}
                            whileHover={{ y: active === s ? 0 : -2 }}
                            whileTap={{ scale: 0.97 }}
                            className={`relative px-5 py-3 font-mono text-xs tracking-[0.2em] uppercase transition-colors ${
                                active === s
                                    ? "bg-[#39FF14] text-[#053900] font-bold"
                                    : "text-on-surface-variant hover:text-on-surface hover:bg-white/5"
                            }`}
                        >
                            {s}
                        </motion.button>
                    ))}
                </motion.div>

                {/* Content */}
                <AnimatePresence mode="wait">
                    <motion.div
                        key={active}
                        initial={{ opacity: 0, y: 16, filter: "blur(6px)" }}
                        animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
                        exit={{ opacity: 0, y: -12, filter: "blur(6px)" }}
                        transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
                    >
                        {SECTION_CONTENT[active]}
                    </motion.div>
                </AnimatePresence>
            </div>
        </div>
    );
}
