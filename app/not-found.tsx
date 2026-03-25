import ErrorView from "./components/ErrorView";

export default function NotFound() {
    return (
        <ErrorView
            code="404 // ROUTE_MISSING"
            title="PAGE NOT FOUND"
            description="The address you hit does not map to a live route in Framework. If you followed an internal link, that page likely has not been wired yet."
            actions={[
                { href: "/", label: "GO_HOME" },
                { href: "/auth/login", label: "LOGIN", secondary: true },
            ]}
        />
    );
}
