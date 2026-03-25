import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/app/lib/prisma";
import { getCurrentUser } from "@/app/lib/auth";
import PptxGenJS from "pptxgenjs";

export async function GET(req: NextRequest) {
    const user = await getCurrentUser();
    if (!user || user.role !== "ORGANIZER") return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const exportType = req.nextUrl.searchParams.get("type") ?? "ceremony";

    const pptx = new PptxGenJS();
    pptx.layout = "LAYOUT_WIDE";
    pptx.author = "Framework 2027";
    pptx.subject = `Framework 2027 — ${exportType}`;

    const BG = "131313";
    const GREEN = "39FF14";
    const GRAY = "baccb0";

    const [awards, projects, stats] = await Promise.all([
        prisma.award.findMany({ include: { winners: { include: { project: { include: { team: true } } } } } }),
        prisma.project.findMany({
            include: {
                team: { include: { members: { include: { user: true } } } },
                judgeAssignments: { include: { score: true } },
            },
        }),
        Promise.all([
            prisma.application.count({ where: { status: "ACCEPTED" } }),
            prisma.team.count(),
            prisma.project.count(),
            prisma.application.count({ where: { checkedIn: true } }),
        ]),
    ]);

    function titleSlide(text: string, sub?: string) {
        const slide = pptx.addSlide();
        slide.background = { color: BG };
        slide.addText("FRAMEWORK_2027", { x: 0.5, y: 0.4, w: "90%", fontSize: 10, color: GREEN, bold: true, fontFace: "Courier New", charSpacing: 8 });
        slide.addText(text, { x: 0.5, y: 1.2, w: "90%", fontSize: 52, color: "E5E2E1", bold: true, italic: true, fontFace: "Arial" });
        if (sub) slide.addText(sub, { x: 0.5, y: 3.2, w: "90%", fontSize: 16, color: GRAY, fontFace: "Courier New" });
        slide.addShape(pptx.ShapeType.rect, { x: 0.5, y: 1.1, w: 0.08, h: 2.4, fill: { color: GREEN } });
        return slide;
    }

    if (exportType === "ceremony") {
        // 1. Title
        titleSlide("FRAMEWORK 2027", "CEREMONY // CLOSING");

        // 2. Stats
        const statsSlide = pptx.addSlide();
        statsSlide.background = { color: BG };
        statsSlide.addText("BY THE NUMBERS", { x: 0.5, y: 0.4, w: "90%", fontSize: 36, color: "E5E2E1", bold: true, italic: true, fontFace: "Arial" });
        const [accepted, teams, projs, checkedIn] = stats;
        const statItems = [
            { label: "HACKERS", value: String(accepted) },
            { label: "TEAMS", value: String(teams) },
            { label: "PROJECTS", value: String(projs) },
            { label: "CHECKED IN", value: String(checkedIn) },
        ];
        statItems.forEach((s, i) => {
            const x = 0.5 + (i % 2) * 5;
            const y = 1.5 + Math.floor(i / 2) * 1.8;
            statsSlide.addText(s.value, { x, y, w: 4, fontSize: 48, color: GREEN, bold: true, fontFace: "Courier New" });
            statsSlide.addText(s.label, { x, y: y + 0.9, w: 4, fontSize: 12, color: GRAY, fontFace: "Courier New", charSpacing: 4 });
        });

        // 3. Awards slides
        for (const award of awards) {
            const aSlide = pptx.addSlide();
            aSlide.background = { color: BG };
            aSlide.addText("★ AWARD", { x: 0.5, y: 0.4, w: "90%", fontSize: 12, color: GREEN, fontFace: "Courier New", charSpacing: 6 });
            aSlide.addText(award.name.toUpperCase(), { x: 0.5, y: 0.9, w: "90%", fontSize: 44, color: "E5E2E1", bold: true, italic: true, fontFace: "Arial" });
            if (award.prize) aSlide.addText(award.prize, { x: 0.5, y: 2.2, w: "90%", fontSize: 18, color: GREEN, fontFace: "Courier New" });
            if (award.winners.length > 0) {
                const w = award.winners[0].project;
                aSlide.addText(w.name.toUpperCase(), { x: 0.5, y: 2.9, w: "90%", fontSize: 28, color: "E5E2E1", bold: true, fontFace: "Arial" });
                aSlide.addText(`TEAM: ${w.team.name}`, { x: 0.5, y: 3.6, w: "90%", fontSize: 14, color: GRAY, fontFace: "Courier New" });
            }
        }

        // 4. Project slides (scored)
        const scored = projects
            .map(p => {
                const scores = p.judgeAssignments.flatMap(a => a.score ? [a.score] : []);
                const avg = scores.length > 0
                    ? scores.reduce((s, sc) => s + sc.innovation + sc.technicalDepth + sc.designUX + sc.impact, 0) / (scores.length * 4)
                    : 0;
                return { ...p, avg };
            })
            .sort((a, b) => b.avg - a.avg)
            .slice(0, 8);

        for (const proj of scored) {
            const pSlide = pptx.addSlide();
            pSlide.background = { color: BG };
            pSlide.addText("PROJECT", { x: 0.5, y: 0.4, w: "90%", fontSize: 10, color: GRAY, fontFace: "Courier New", charSpacing: 6 });
            pSlide.addText(proj.name.toUpperCase(), { x: 0.5, y: 0.8, w: "90%", fontSize: 40, color: "E5E2E1", bold: true, italic: true, fontFace: "Arial" });
            pSlide.addText(`TEAM: ${proj.team.name}`, { x: 0.5, y: 2.1, w: "90%", fontSize: 14, color: GREEN, fontFace: "Courier New" });
            pSlide.addText(proj.description.slice(0, 300), { x: 0.5, y: 2.7, w: "90%", fontSize: 14, color: GRAY, fontFace: "Courier New" });
            pSlide.addText(`SCORE: ${proj.avg.toFixed(2)} / 5.00`, { x: 7, y: 0.8, w: 3, fontSize: 20, color: GREEN, bold: true, fontFace: "Courier New", align: "right" });
        }

        // 5. Closing slide
        titleSlide("THANK YOU", "PHHS HACK CLUB // FRAMEWORK 2027");
    }

    if (exportType === "projects") {
        titleSlide("ALL PROJECTS", `${projects.length} SUBMITTED`);
        for (const proj of projects) {
            const slide = pptx.addSlide();
            slide.background = { color: BG };
            slide.addText(proj.name.toUpperCase(), { x: 0.5, y: 0.5, w: "90%", fontSize: 36, color: "E5E2E1", bold: true, italic: true, fontFace: "Arial" });
            slide.addText(`Team: ${proj.team.name}`, { x: 0.5, y: 1.7, w: "90%", fontSize: 14, color: GREEN, fontFace: "Courier New" });
            slide.addText(proj.description.slice(0, 400), { x: 0.5, y: 2.3, w: "90%", fontSize: 13, color: GRAY, fontFace: "Courier New" });
            slide.addText(`STACK: ${proj.techStack}`, { x: 0.5, y: 4.0, w: "90%", fontSize: 11, color: GRAY, fontFace: "Courier New" });
        }
    }

    if (exportType === "scores") {
        titleSlide("JUDGING SCORES", "AGGREGATE RESULTS");
        const scored = projects.map(p => {
            const scores = p.judgeAssignments.flatMap(a => a.score ? [a.score] : []);
            if (scores.length === 0) return { name: p.name, team: p.team.name, innovation: 0, technical: 0, design: 0, impact: 0, avg: 0 };
            const n = scores.length;
            return {
                name: p.name, team: p.team.name,
                innovation: scores.reduce((s, sc) => s + sc.innovation, 0) / n,
                technical: scores.reduce((s, sc) => s + sc.technicalDepth, 0) / n,
                design: scores.reduce((s, sc) => s + sc.designUX, 0) / n,
                impact: scores.reduce((s, sc) => s + sc.impact, 0) / n,
                avg: scores.reduce((s, sc) => s + sc.innovation + sc.technicalDepth + sc.designUX + sc.impact, 0) / (n * 4),
            };
        }).sort((a, b) => b.avg - a.avg);

        const scoreSlide = pptx.addSlide();
        scoreSlide.background = { color: BG };
        scoreSlide.addText("LEADERBOARD", { x: 0.5, y: 0.3, w: "90%", fontSize: 28, color: "E5E2E1", bold: true, italic: true, fontFace: "Arial" });
        scored.slice(0, 15).forEach((p, i) => {
            const y = 1.2 + i * 0.3;
            scoreSlide.addText(`${(i + 1).toString().padStart(2, "0")}`, { x: 0.5, y, w: 0.5, fontSize: 11, color: GREEN, fontFace: "Courier New" });
            scoreSlide.addText(p.name, { x: 1.1, y, w: 5, fontSize: 11, color: "E5E2E1", fontFace: "Courier New" });
            scoreSlide.addText(p.avg.toFixed(2), { x: 6.2, y, w: 1.5, fontSize: 11, color: GREEN, fontFace: "Courier New", align: "right" });
        });
    }

    const buffer = await pptx.write({ outputType: "nodebuffer" });
    return new NextResponse(buffer as unknown as BodyInit, {
        headers: {
            "Content-Type": "application/vnd.openxmlformats-officedocument.presentationml.presentation",
            "Content-Disposition": `attachment; filename="framework2027_${exportType}.pptx"`,
        },
    });
}
