"use client";

import RouteErrorBoundary from "../components/RouteErrorBoundary";

export default function OrganizerError({
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
            title="ORGANIZER PANEL FAILURE"
            description="The organizer interface failed unexpectedly. Retry the page or return to the command center."
            homeHref="/organizer"
        />
    );
}
