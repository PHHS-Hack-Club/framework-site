"use client";

export default function TeamPage() {
    return (
        <div className="max-w-2xl space-y-6">
            <h1 className="text-4xl font-black italic tracking-tighter uppercase">TEAM_FLOW_MOVED</h1>
            <div className="border border-[#39FF14]/20 bg-surface-container-high p-6 font-mono text-sm leading-7 text-on-surface-variant">
                Team creation and joining now live inside the project submission page. That flow opens when organizers unlock day-of submissions.
            </div>
            <a
                href="/hacker/project"
                className="inline-flex border border-[#39FF14] px-5 py-3 font-mono text-xs uppercase tracking-[0.2em] text-[#39FF14] transition hover:bg-[#39FF14]/8"
            >
                GO_TO_PROJECT_FLOW
            </a>
        </div>
    );
}
