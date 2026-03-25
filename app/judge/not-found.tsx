import ErrorView from "../components/ErrorView";

export default function JudgeNotFound() {
    return (
        <ErrorView
            code="JUDGE_404"
            title="JUDGE ROUTE MISSING"
            description="That judging route does not exist or has not been opened yet."
            actions={[
                { href: "/judge", label: "JUDGE_HOME" },
                { href: "/", label: "LANDING", secondary: true },
            ]}
        />
    );
}
