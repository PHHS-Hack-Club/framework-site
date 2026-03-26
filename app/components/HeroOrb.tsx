"use client";

import { motion } from "framer-motion";

type RingProps = {
    inset: string;
    tilt: string;         // rotateX + optional rotateZ for the fixed axis
    duration: number;
    direction: "cw" | "ccw";
    opacity: number;
    thickness?: number;
};

function Ring({ inset, tilt, duration, direction, opacity, thickness = 1 }: RingProps) {
    return (
        // Outer div holds the tilt — never animated
        <div style={{ position: "absolute", inset, transform: tilt, transformStyle: "preserve-3d" }}>
            {/* Inner div spins on the Z axis */}
            <div style={{
                position: "absolute", inset: 0,
                borderRadius: "50%",
                border: `${thickness}px solid rgba(57,255,20,${opacity})`,
                animation: `orb-spin-${direction} ${duration}s linear infinite`,
            }} />
        </div>
    );
}

export default function HeroOrb() {
    return (
        <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.5, duration: 1.1, ease: "easeOut" }}
            className="relative flex items-center justify-center w-full h-full select-none"
            aria-hidden
        >
            <div style={{ position: "relative", width: 360, height: 360 }}>

                {/* Atmospheric backing glow */}
                <div style={{
                    position: "absolute", inset: 0,
                    borderRadius: "50%",
                    background: "radial-gradient(circle, rgba(57,255,20,0.09) 0%, transparent 68%)",
                    animation: "glow-breathe 3s ease-in-out infinite",
                }} />

                {/* Perspective container for all rings */}
                <div style={{
                    position: "absolute", inset: 0,
                    perspective: "860px",
                    transformStyle: "preserve-3d",
                }}>
                    {/* Ring 1 — equatorial, bright, slow CW */}
                    <Ring inset="10%" tilt="rotateX(70deg)" duration={12} direction="cw" opacity={0.85} thickness={1.5} />
                    {/* Ring 2 — 35° tilt, medium, CCW */}
                    <Ring inset="18%" tilt="rotateX(55deg) rotateZ(35deg)" duration={18} direction="ccw" opacity={0.45} />
                    {/* Ring 3 — steep tilt, faint, CW */}
                    <Ring inset="16%" tilt="rotateX(80deg) rotateZ(-55deg)" duration={26} direction="cw" opacity={0.28} />
                    {/* Ring 4 — outer, ghost, CCW */}
                    <Ring inset="2%" tilt="rotateX(65deg) rotateZ(18deg)" duration={38} direction="ccw" opacity={0.15} />
                </div>

                {/* Rim glow halo — flat, no perspective */}
                <div style={{
                    position: "absolute", inset: "20%",
                    borderRadius: "50%",
                    background: "radial-gradient(circle, transparent 35%, rgba(57,255,20,0.16) 62%, rgba(57,255,20,0.05) 78%, transparent 100%)",
                    animation: "glow-breathe 3s ease-in-out infinite",
                }} />

                {/* Core orb */}
                <div style={{
                    position: "absolute", inset: 0,
                    display: "flex", alignItems: "center", justifyContent: "center",
                }}>
                    <div style={{
                        width: 20, height: 20,
                        borderRadius: "50%",
                        background: "#39FF14",
                        boxShadow: [
                            "0 0 0 5px rgba(57,255,20,0.10)",
                            "0 0 20px rgba(57,255,20,0.90)",
                            "0 0 50px rgba(57,255,20,0.55)",
                            "0 0 90px rgba(57,255,20,0.25)",
                        ].join(", "),
                        animation: "pulse-glow 3s ease-in-out infinite",
                    }} />
                </div>
            </div>

            <style>{`
                @keyframes orb-spin-cw  { to { transform: rotate(360deg);  } }
                @keyframes orb-spin-ccw { to { transform: rotate(-360deg); } }
            `}</style>
        </motion.div>
    );
}
