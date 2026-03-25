import { PrismaClient } from "@prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";
import bcrypt from "bcryptjs";
import "dotenv/config";

const adapter = new PrismaPg({ connectionString: process.env.DATABASE_URL! });
const prisma = new PrismaClient({ adapter });

async function main() {
    console.log("🌱 Seeding database...");

    // Create organizer
    const orgEmail = process.env.SEED_ORGANIZER_EMAIL ?? "organizer@framework2027.dev";
    const orgPassword = process.env.SEED_ORGANIZER_PASSWORD ?? "ChangeMe123!";
    const passwordHash = await bcrypt.hash(orgPassword, 12);

    const organizer = await prisma.user.upsert({
        where: { email: orgEmail },
        update: { role: "ORGANIZER", emailVerified: true, passwordHash },
        create: {
            email: orgEmail,
            passwordHash,
            firstName: "Framework",
            lastName: "Organizer",
            role: "ORGANIZER",
            emailVerified: true,
        },
    });
    console.log(`✓ Organizer: ${organizer.email}`);

    // Seed schedule events
    const events = [
        { title: "OPERATOR_CHECK_IN", location: "MAIN_LOBBY", day: 1, startTime: "09:00", endTime: "10:00", tag: null },
        { title: "SYSTEM_BOOT (OPENING CEREMONY)", location: "AUDITORIUM", day: 1, startTime: "10:00", endTime: "11:00", tag: "CEREMONY" },
        { title: "HACKING_START", location: null, day: 1, startTime: "11:00", endTime: null, tag: "LIVE" },
        { title: "LUNCH_PROTOCOL", location: "REFECTORY", day: 1, startTime: "13:00", endTime: "14:00", tag: "MEAL" },
        { title: "HARDWARE_WORKSHOP_01", location: "LAB_7", day: 1, startTime: "14:00", endTime: "15:30", tag: "WORKSHOP" },
        { title: "DINNER_PROTOCOL", location: "REFECTORY", day: 1, startTime: "19:00", endTime: "20:00", tag: "MEAL" },
        { title: "MIDNIGHT_SNACKS", location: "MAIN_FLOOR", day: 1, startTime: "00:00", endTime: null, tag: "MEAL" },
        { title: "BREAKFAST_PROTOCOL", location: "REFECTORY", day: 2, startTime: "08:00", endTime: "09:00", tag: "MEAL" },
        { title: "HACKING_END", location: null, day: 2, startTime: "11:00", endTime: null, tag: "LIVE" },
        { title: "PROJECT_JUDGING", location: "MAIN_FLOOR", day: 2, startTime: "11:30", endTime: "13:30", tag: null },
        { title: "CLOSING_CEREMONY", location: "AUDITORIUM", day: 2, startTime: "15:00", endTime: "16:00", tag: "CEREMONY" },
    ];

    for (const e of events) {
        await prisma.scheduleEvent.upsert({
            where: { id: `seed-${e.title.toLowerCase().replace(/\s/g, "-")}` },
            update: {},
            create: { id: `seed-${e.title.toLowerCase().replace(/\s/g, "-")}`, ...e },
        });
    }
    console.log(`✓ ${events.length} schedule events seeded`);

    // Seed awards
    const awards = [
        { id: "seed-award-best-overall", name: "Best Overall", prize: "$500 Gift Card", description: "The best project at Framework 2027." },
        { id: "seed-award-best-hardware", name: "Best Hardware Hack", prize: "Raspberry Pi Kit", description: "Most creative use of physical hardware." },
        { id: "seed-award-best-beginner", name: "Best Beginner Project", prize: "$200 Gift Card", description: "Best project from a first-time hacker." },
        { id: "seed-award-most-impactful", name: "Most Impactful", prize: "$300 Gift Card", description: "Project with the greatest potential for real-world impact." },
    ];

    for (const a of awards) {
        await prisma.award.upsert({ where: { id: a.id }, update: {}, create: a });
    }
    console.log(`✓ ${awards.length} awards seeded`);

    console.log("\n✅ Done! Login at http://localhost:3000/auth/login");
    console.log(`   Email: ${orgEmail}`);
    console.log(`   Password: ${orgPassword}`);
}

main().catch(console.error).finally(() => prisma.$disconnect());
