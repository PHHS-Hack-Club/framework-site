import { getCurrentUser } from "@/app/lib/auth";
import { redirect } from "next/navigation";
import OrganizerNav from "./components/OrganizerNav";

export default async function OrganizerLayout({ children }: { children: React.ReactNode }) {
    const user = await getCurrentUser();
    if (!user || user.role !== "ORGANIZER") redirect("/auth/login?error=unauthorized");

    return (
        <div className="min-h-screen bg-background text-on-surface font-body flex">
            <OrganizerNav user={{ email: user.email, firstName: user.firstName }} />
            <main className="flex-1 ml-64 p-8 min-h-screen">
                <div className="max-w-6xl mx-auto">{children}</div>
            </main>
        </div>
    );
}
