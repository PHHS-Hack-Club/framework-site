import Link from "next/link";
import type { ReactNode } from "react";

type Action = {
    href: string;
    label: string;
    secondary?: boolean;
};

export default function ErrorView({
    code,
    title,
    description,
    actions,
    footer,
}: {
    code: string;
    title: string;
    description: string;
    actions?: Action[];
    footer?: ReactNode;
}) {
    return (
        <div className="min-h-[60vh] flex items-center justify-center px-6 py-20">
            <div className="w-full max-w-3xl border border-[#39FF14]/20 bg-[#0d0f0d] p-8 shadow-[0_0_80px_rgba(57,255,20,0.08)]">
                <div className="font-mono text-xs uppercase tracking-[0.32em] text-[#39FF14]">{code}</div>
                <h1 className="mt-4 text-4xl font-black italic uppercase tracking-tighter md:text-6xl">{title}</h1>
                <p className="mt-6 max-w-2xl font-mono text-sm leading-7 text-on-surface-variant">{description}</p>

                {actions && actions.length > 0 && (
                    <div className="mt-8 flex flex-wrap gap-3">
                        {actions.map((action) => (
                            <Link
                                key={action.href + action.label}
                                href={action.href}
                                className={`px-5 py-3 font-mono text-xs uppercase tracking-[0.2em] transition ${
                                    action.secondary
                                        ? "border border-outline-variant/30 text-on-surface-variant hover:border-[#39FF14] hover:text-[#39FF14]"
                                        : "bg-[#39FF14] text-[#053900] hover:shadow-[0_0_30px_rgba(57,255,20,0.3)]"
                                }`}
                            >
                                {action.label}
                            </Link>
                        ))}
                    </div>
                )}

                {footer ? <div className="mt-8">{footer}</div> : null}
            </div>
        </div>
    );
}
