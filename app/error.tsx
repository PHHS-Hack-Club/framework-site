"use client";

import RouteErrorBoundary from "./components/RouteErrorBoundary";

export default function Error({
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
            title="UNEXPECTED SYSTEM ERROR"
            description="Something broke while rendering this page. Retry once, then fall back to the homepage if the issue persists."
            homeHref="/"
        />
    );
}
