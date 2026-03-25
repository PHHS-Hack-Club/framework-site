import ErrorView from "../components/ErrorView";

export default function HackerNotFound() {
    return (
        <ErrorView
            code="HACKER_404"
            title="PORTAL PAGE MISSING"
            description="That hacker portal route is not available. Use the dashboard or profile page to recover."
            actions={[
                { href: "/hacker", label: "DASHBOARD" },
                { href: "/hacker/profile", label: "PROFILE", secondary: true },
            ]}
        />
    );
}
