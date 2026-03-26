"use client";

import { Canvas } from "@react-three/fiber";
import { OrbitControls } from "@react-three/drei";
import * as THREE from "three";

export default function HeroScene() {
    return (
        <Canvas
            className="h-full w-full"
            camera={{ position: [1.2, 0.8, 5.2], fov: 42 }}
            style={{ width: "100%", height: "100%", background: "transparent", cursor: "none" }}
            gl={{
                alpha: true,
                antialias: false,
                powerPreference: "high-performance",
                toneMapping: THREE.NoToneMapping,
            }}
            dpr={[0.6, 0.9]}
        >
            <mesh>
                <icosahedronGeometry args={[1.8, 1]} />
                <meshBasicMaterial color="#39FF14" wireframe />
            </mesh>
            <OrbitControls
                enableZoom={false}
                enablePan={false}
                autoRotate
                autoRotateSpeed={1.8}
                rotateSpeed={0.65}
                dampingFactor={0.07}
                enableDamping
            />
        </Canvas>
    );
}
