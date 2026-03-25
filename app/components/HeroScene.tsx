"use client";

import { useRef, useMemo } from "react";
import { Canvas, useFrame, extend } from "@react-three/fiber";
import type { ThreeElement } from "@react-three/fiber";
import { shaderMaterial } from "@react-three/drei";
import * as THREE from "three";

// ─── Rim glow: single BackSide sphere, cheap fresnel ─────────────────────────
const RimGlowMaterial = shaderMaterial(
    { time: 0 },
    `varying vec3 vNormal;
    void main() {
        vNormal = normalize(normalMatrix * normal);
        gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
    }`,
    `uniform float time;
    varying vec3 vNormal;
    void main() {
        float rim = pow(1.0 - abs(vNormal.z), 3.2);
        float pulse = 0.80 + 0.20 * sin(time * 1.7);
        gl_FragColor = vec4(0.22, 1.0, 0.08, rim * pulse * 0.70);
    }`
);
extend({ RimGlowMaterial });

declare module "@react-three/fiber" {
    interface ThreeElements {
        rimGlowMaterial: ThreeElement<typeof RimGlowMaterial>;
    }
}

// ─── Crisp line ring (THREE.Line, zero lighting cost) ─────────────────────────
function Ring({
    radius,
    opacity,
    tilt,
    spinSpeed,
    spinAxis = "z",
}: {
    radius: number;
    opacity: number;
    tilt?: [number, number, number];
    spinSpeed: number;
    spinAxis?: "x" | "y" | "z";
}) {
    const groupRef = useRef<THREE.Group>(null);

    // Build once — 96 pts is smooth enough for a circle at this scale
    const lineObj = useMemo(() => {
        const pts: THREE.Vector3[] = [];
        const SEG = 96;
        for (let i = 0; i <= SEG; i++) {
            const a = (i / SEG) * Math.PI * 2;
            pts.push(new THREE.Vector3(Math.cos(a) * radius, 0, Math.sin(a) * radius));
        }
        const geom = new THREE.BufferGeometry().setFromPoints(pts);
        const mat = new THREE.LineBasicMaterial({
            color: 0x39ff14,
            transparent: true,
            opacity,
            depthWrite: false,
        });
        return new THREE.Line(geom, mat);
    }, [radius, opacity]);

    useFrame(({ clock }) => {
        if (!groupRef.current) return;
        const v = clock.elapsedTime * spinSpeed;
        groupRef.current.rotation[spinAxis] = v;
    });

    return (
        <group ref={groupRef} rotation={tilt ?? [0, 0, 0]}>
            <primitive object={lineObj} />
        </group>
    );
}

// ─── Orb: core + geodesic wireframe + rim glow ────────────────────────────────
function Orb() {
    const coreRef = useRef<THREE.Mesh>(null);
    const icoRef = useRef<THREE.Mesh>(null);
    const glowRef = useRef<{ time: number } | null>(null);

    useFrame(({ clock }) => {
        const t = clock.elapsedTime;
        if (coreRef.current) {
            const s = 1 + Math.sin(t * 2.1) * 0.05;
            coreRef.current.scale.setScalar(s);
        }
        if (icoRef.current) {
            icoRef.current.rotation.x = Math.sin(t * 0.17) * 0.4;
            icoRef.current.rotation.y = t * 0.12;
            icoRef.current.rotation.z = Math.cos(t * 0.14) * 0.18;
        }
        if (glowRef.current) glowRef.current.time = t;
    });

    return (
        <group>
            {/* Bright solid core */}
            <mesh ref={coreRef}>
                <sphereGeometry args={[0.48, 32, 32]} />
                <meshBasicMaterial color="#39FF14" />
            </mesh>

            {/* Geodesic wireframe shell — low-poly looks more "system/data" than sphere */}
            <mesh ref={icoRef}>
                <icosahedronGeometry args={[1.15, 1]} />
                <meshBasicMaterial color="#39FF14" wireframe transparent opacity={0.18} />
            </mesh>

            {/* BackSide rim glow — ONE mesh, not five stacked spheres */}
            <mesh>
                <sphereGeometry args={[1.58, 24, 24]} />
                <rimGlowMaterial
                    ref={glowRef as any}
                    transparent
                    side={THREE.BackSide}
                    depthWrite={false}
                />
            </mesh>
        </group>
    );
}

// ─── All orbital particles in ONE draw call ───────────────────────────────────
function OrbitalParticles() {
    const ref = useRef<THREE.Points>(null);

    const { positions, sizes } = useMemo(() => {
        // Equatorial ring trace (ring 1 path)
        const n1 = 80;
        // Tilted ring trace (ring 3 path)
        const n2 = 60;
        const total = n1 + n2;

        const positions = new Float32Array(total * 3);
        const sizes = new Float32Array(total);

        const tiltMat = new THREE.Matrix4()
            .makeRotationX(0.9)
            .multiply(new THREE.Matrix4().makeRotationZ(0.55));
        const v = new THREE.Vector3();

        for (let i = 0; i < n1; i++) {
            const a = (i / n1) * Math.PI * 2;
            const r = 1.82 + (Math.sin(i * 7.3) * 0.5 + 0.5) * 0.1;
            positions[i * 3]     = Math.cos(a) * r;
            positions[i * 3 + 1] = (Math.sin(i * 3.7) * 0.5 + 0.5 - 0.5) * 0.12;
            positions[i * 3 + 2] = Math.sin(a) * r;
            sizes[i] = 0.055 + (Math.sin(i * 5.1) * 0.5 + 0.5) * 0.025;
        }

        for (let i = 0; i < n2; i++) {
            const ii = i + n1;
            const a = (i / n2) * Math.PI * 2;
            const r = 2.18 + (Math.sin(i * 6.1) * 0.5 + 0.5) * 0.08;
            v.set(Math.cos(a) * r, (Math.sin(i * 4.3) * 0.5 + 0.5 - 0.5) * 0.1, Math.sin(a) * r);
            v.applyMatrix4(tiltMat);
            positions[ii * 3]     = v.x;
            positions[ii * 3 + 1] = v.y;
            positions[ii * 3 + 2] = v.z;
            sizes[ii] = 0.042 + (Math.sin(i * 8.7) * 0.5 + 0.5) * 0.02;
        }

        return { positions, sizes };
    }, []);

    // Split animation: equatorial spins one way, tilted the other
    const equatorialRef = useRef<THREE.Points>(null);
    const tiltedRef = useRef<THREE.Points>(null);

    const equatorialPos = useMemo(() => positions.slice(0, 80 * 3), [positions]);
    const tiltedPos = useMemo(() => positions.slice(80 * 3), [positions]);

    useFrame(({ clock }) => {
        const t = clock.elapsedTime;
        if (equatorialRef.current) equatorialRef.current.rotation.y = t * 0.3;
        if (tiltedRef.current) {
            tiltedRef.current.rotation.y = -t * 0.18;
        }
    });

    return (
        <>
            <points ref={equatorialRef}>
                <bufferGeometry>
                    <bufferAttribute attach="attributes-position" args={[equatorialPos, 3]} />
                </bufferGeometry>
                <pointsMaterial size={0.055} color="#39FF14" transparent opacity={0.9} depthWrite={false} sizeAttenuation />
            </points>
            <points ref={tiltedRef}>
                <bufferGeometry>
                    <bufferAttribute attach="attributes-position" args={[tiltedPos, 3]} />
                </bufferGeometry>
                <pointsMaterial size={0.042} color="#39FF14" transparent opacity={0.65} depthWrite={false} sizeAttenuation />
            </points>
        </>
    );
}

// ─── Scene root ───────────────────────────────────────────────────────────────
function Scene() {
    const groupRef = useRef<THREE.Group>(null);

    useFrame(({ clock }) => {
        if (groupRef.current) {
            // Gentle slow sway — no per-frame camera movement
            groupRef.current.rotation.y = Math.sin(clock.elapsedTime * 0.08) * 0.12;
            groupRef.current.position.y = Math.sin(clock.elapsedTime * 0.35) * 0.06;
        }
    });

    return (
        <group ref={groupRef}>
            <Orb />

            {/* Ring 1 — equatorial, brightest */}
            <Ring radius={1.82} opacity={0.88} tilt={[Math.PI / 2, 0, 0]} spinSpeed={0.28} spinAxis="z" />

            {/* Ring 2 — 35° tilt, medium */}
            <Ring radius={2.08} opacity={0.55} tilt={[0.6, 0, 0.3]} spinSpeed={-0.18} spinAxis="z" />

            {/* Ring 3 — steep tilt, ghost */}
            <Ring radius={1.68} opacity={0.38} tilt={[0.9, 0.5, 0]} spinSpeed={0.22} spinAxis="x" />

            {/* Ring 4 — outer, very faint */}
            <Ring radius={2.72} opacity={0.22} tilt={[0.25, 0, 0.6]} spinSpeed={-0.1} spinAxis="y" />

            <OrbitalParticles />
        </group>
    );
}

// ─── Export ───────────────────────────────────────────────────────────────────
export default function HeroScene() {
    return (
        <Canvas
            camera={{ position: [0, 0, 6.5], fov: 40 }}
            style={{ background: "transparent" }}
            gl={{
                alpha: true,
                antialias: false,
                powerPreference: "high-performance",
                toneMapping: THREE.NoToneMapping,
            }}
            dpr={[0.8, 1.2]}
        >
            <Scene />
        </Canvas>
    );
}
