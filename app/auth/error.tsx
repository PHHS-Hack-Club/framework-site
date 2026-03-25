"use client";

import RouteErrorBoundary from "../components/RouteErrorBoundary";

export default function AuthError({
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
            title="AUTH FLOW FAILURE"
            description="Something failed inside login or signup. Retry, then go back to the auth entrypoint if needed."
            homeHref="/auth/login"
        />
    );
}
