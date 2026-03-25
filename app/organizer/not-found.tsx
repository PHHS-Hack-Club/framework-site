import ErrorView from "../components/ErrorView";

export default function OrganizerNotFound() {
    return (
        <ErrorView
            code="ORGANIZER_404"
            title="ADMIN ROUTE MISSING"
            description="That organizer route does not exist. Return to the command center or a known organizer tool."
            actions={[
                { href: "/organizer", label: "COMMAND_CENTER" },
                { href: "/organizer/applications", label: "APPLICATIONS", secondary: true },
            ]}
        />
    );
}
