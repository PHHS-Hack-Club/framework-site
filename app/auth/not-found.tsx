import ErrorView from "../components/ErrorView";

export default function AuthNotFound() {
    return (
        <ErrorView
            code="AUTH_404"
            title="AUTH PAGE MISSING"
            description="That auth route does not exist. Use the standard login or signup entrypoints instead."
            actions={[
                { href: "/auth/login", label: "LOGIN" },
                { href: "/auth/signup", label: "SIGNUP", secondary: true },
            ]}
        />
    );
}
