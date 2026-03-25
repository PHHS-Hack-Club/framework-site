"use client";

import { useEffect } from "react";
import ErrorView from "./ErrorView";

export default function RouteErrorBoundary({
    error,
    reset,
    title,
    description,
    homeHref,
}: {
    error: Error & { digest?: string };
    reset: () => void;
    title: string;
    description: string;
    homeHref: string;
}) {
    useEffect(() => {
        console.error(error);
    }, [error]);

    return (
        <ErrorView
            code="RUNTIME_FAILURE"
            title={title}
            description={description}
            actions={[
                { href: homeHref, label: "GO_BACK" },
            ]}
            footer={
                <button
                    type="button"
                    onClick={reset}
                    className="border border-outline-variant/30 px-5 py-3 font-mono text-xs uppercase tracking-[0.2em] text-on-surface-variant transition hover:border-[#39FF14] hover:text-[#39FF14]"
                >
                    RETRY
                </button>
            }
        />
    );
}
