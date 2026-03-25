import { getCurrentUser } from "@/app/lib/auth";
import { redirect } from "next/navigation";
import JudgeNav from "./components/JudgeNav";

export default async function JudgeLayout({ children }: { children: React.ReactNode }) {
    const user = await getCurrentUser();
    if (!user || user.role !== "JUDGE") redirect("/auth/login?error=unauthorized");

    return (
        <div className="min-h-screen bg-background text-on-surface font-body flex">
            <JudgeNav user={{ email: user.email, firstName: user.firstName }} />
            <main className="flex-1 ml-64 p-8 min-h-screen">
                <div className="max-w-4xl mx-auto">{children}</div>
            </main>
        </div>
    );
}
