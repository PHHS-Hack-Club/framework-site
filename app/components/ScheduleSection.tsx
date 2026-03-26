import { prisma } from "@/app/lib/prisma";
import ScheduleSectionClient from "./ScheduleSectionClient";

export default async function ScheduleSection() {
    const events = await prisma.scheduleEvent.findMany({
        orderBy: [{ day: "asc" }, { startTime: "asc" }],
    });

    if (events.length === 0) return null;

    // Group by day number
    const byDay = new Map<number, typeof events>();
    for (const ev of events) {
        if (!byDay.has(ev.day)) byDay.set(ev.day, []);
        byDay.get(ev.day)!.push(ev);
    }

    const groups = Array.from(byDay.entries()).map(([day, evs]) => ({
        day: day === 1 ? "EVENT_DAY" : `DAY_${day}`,
        events: evs,
    }));

    return <ScheduleSectionClient groups={groups} />;
}
