import { getCurrentUser } from "@/app/lib/auth";
import { redirect } from "next/navigation";
import HackerNav from "./components/HackerNav";

export default async function HackerLayout({ children }: { children: React.ReactNode }) {
    const user = await getCurrentUser();
    if (!user) redirect("/auth/login");

    return (
        <div className="min-h-screen bg-background text-on-surface font-body flex">
            <HackerNav user={{ email: user.email, firstName: user.firstName, role: user.role }} />
            <main className="flex-1 ml-64 p-8 min-h-screen">
                <div className="max-w-5xl mx-auto">
                    {children}
                </div>
            </main>
        </div>
    );
}
