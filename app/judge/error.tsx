"use client";

import RouteErrorBoundary from "../components/RouteErrorBoundary";

export default function JudgeError({
    error,
    reset,
}: {
    error: Error & { digest?: string };
    reset: () => void;
}) {
    return (
        <RouteErrorBoundary
            error={error}
            reset={reset}
            title="JUDGE PORTAL FAILURE"
            description="The judging interface hit an unexpected error. Retry here or return to the judge dashboard."
            homeHref="/judge"
        />
    );
}
