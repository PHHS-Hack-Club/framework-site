"use client";

import RouteErrorBoundary from "../components/RouteErrorBoundary";

export default function HackerError({
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
            title="HACKER PORTAL FAILURE"
            description="The hacker portal hit an unexpected error. Retry the current view or return to the dashboard."
            homeHref="/hacker"
        />
    );
}
