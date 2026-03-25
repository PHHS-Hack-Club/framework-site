"use client";

import { useEffect } from "react";
import ErrorView from "./components/ErrorView";
import "./globals.css";

export default function GlobalError({
    error,
    reset,
}: {
    error: Error & { digest?: string };
    reset: () => void;
}) {
    useEffect(() => {
        console.error(error);
    }, [error]);

    return (
        <html lang="en" className="dark">
            <body className="bg-background text-on-surface font-body">
                <ErrorView
                    code="GLOBAL_FAILURE"
                    title="ROOT LAYOUT CRASHED"
                    description="The application failed before the normal layout could render. Retry from here or return to the landing page."
                    actions={[
                        { href: "/", label: "GO_HOME" },
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
            </body>
        </html>
    );
}
