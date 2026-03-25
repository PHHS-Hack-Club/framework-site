"use client";

import { useRef, useMemo } from "react";
import { Canvas, useFrame, useThree, extend } from "@react-three/fiber";
import { shaderMaterial, Torus, Points, PointMaterial } from "@react-three/drei";
import * as THREE from "three";

// ─── ASCII Post-Process Shader ──────────────────────────────────────────────
// We achieve the "ASCII" look via a screen-space fragment shader that:
// 1. Samples luminance of each "cell"
// 2. Outputs a green-bright value based on a subtle brightness quantization
// It runs as a full-screen quad over a render target.

const AsciiMaterial = shaderMaterial(
    {
        tDiffuse: null,
        resolution: new THREE.Vector2(1, 1),
        cellSize: 6.0,
        time: 0,
    },
    // Vertex
    `
    varying vec2 vUv;
    void main() {
      vUv = uv;
      gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
    }
  `,
    // Fragment — quantize bright areas into neon green "pixels" with slight dithering
    `
    uniform sampler2D tDiffuse;
    uniform vec2 resolution;
    uniform float cellSize;
    uniform float time;
    varying vec2 vUv;

    float rand(vec2 co) {
      return fract(sin(dot(co, vec2(12.9898, 78.233))) * 43758.5453);
    }

    void main() {
      vec2 uv = vUv;
      
      // Sample cell center
      vec2 cell = floor(uv * resolution / cellSize) * cellSize / resolution;
      vec4 col = texture2D(tDiffuse, cell + cellSize * 0.5 / resolution);

      // Luminance
      float lum = dot(col.rgb, vec3(0.299, 0.587, 0.114));

      // Only render bright pixels
      if (lum < 0.04) {
        gl_FragColor = vec4(0.075, 0.075, 0.075, 1.0); // dark cell
        return;
      }

      // Quantize brightness into steps
      float steps = 5.0;
      float q = floor(lum * steps) / steps;

      // Add subtle scanline noise
      float noise = rand(cell + floor(time * 2.0)) * 0.04;
      q = clamp(q + noise, 0.0, 1.0);

      // Neon green output
      vec3 neon = vec3(0.22, 1.0, 0.08) * q;

      // Add slight scanline darkening
      float scanline = sin(uv.y * resolution.y * 3.14159) * 0.5 + 0.5;
      neon *= mix(0.85, 1.0, scanline);

      gl_FragColor = vec4(neon, 1.0);
    }
  `
);
extend({ AsciiMaterial });

declare module "@react-three/fiber" {
    interface ThreeElements {
        asciiMaterial: any;
    }
}

// ─── ASCII Post-Process Pass ─────────────────────────────────────────────────
function AsciiPass({ renderTarget }: { renderTarget: THREE.WebGLRenderTarget }) {
    const matRef = useRef<any>(null);
    const { size } = useThree();

    useFrame(({ clock }) => {
        if (matRef.current) {
            matRef.current.time = clock.elapsedTime;
            matRef.current.resolution.set(size.width, size.height);
        }
    });

    return (
        <mesh position={[0, 0, 0.01]}>
            <planeGeometry args={[2, 2]} />
            <asciiMaterial
                ref={matRef}
                tDiffuse={renderTarget.texture}
                resolution={new THREE.Vector2(size.width, size.height)}
                cellSize={5}
                depthTest={false}
                depthWrite={false}
            />
        </mesh>
    );
}

// ─── Core Orb (renders to offscreen target) ──────────────────────────────────
function OrbScene() {
    const orbRef = useRef<THREE.Mesh>(null);
    const ring1 = useRef<THREE.Mesh>(null);
    const ring2 = useRef<THREE.Mesh>(null);
    const ring3 = useRef<THREE.Mesh>(null);
    const coreRef = useRef<THREE.Mesh>(null);

    useFrame(({ clock }) => {
        const t = clock.elapsedTime;
        if (orbRef.current) {
            orbRef.current.rotation.x = Math.sin(t * 0.3) * 0.3;
            orbRef.current.rotation.y = t * 0.2;
        }
        if (ring1.current) {
            ring1.current.rotation.z = t * 0.4;
            ring1.current.rotation.x = t * 0.15;
        }
        if (ring2.current) {
            ring2.current.rotation.x = -t * 0.25;
            ring2.current.rotation.z = t * 0.18;
        }
        if (ring3.current) {
            ring3.current.rotation.y = t * 0.35;
            ring3.current.rotation.x = Math.sin(t * 0.2) * 0.5;
        }
        if (coreRef.current) {
            const pulse = 1 + Math.sin(t * 2) * 0.06;
            coreRef.current.scale.setScalar(pulse);
        }
    });

    return (
        <group>
            {/* Glowing core sphere */}
            <mesh ref={coreRef}>
                <sphereGeometry args={[0.7, 64, 64]} />
                <meshStandardMaterial
                    color="#39FF14"
                    emissive="#39FF14"
                    emissiveIntensity={3}
                    transparent
                    opacity={0.9}
                />
            </mesh>

            {/* Distorted outer shell */}
            <mesh ref={orbRef}>
                <sphereGeometry args={[1.4, 32, 32]} />
                <meshStandardMaterial
                    color="#39FF14"
                    emissive="#1a8c00"
                    emissiveIntensity={0.5}
                    wireframe
                    transparent
                    opacity={0.35}
                />
            </mesh>

            {/* Icosahedron shell */}
            <mesh ref={ring3}>
                <icosahedronGeometry args={[1.9, 1]} />
                <meshStandardMaterial
                    color="#39FF14"
                    emissive="#39FF14"
                    emissiveIntensity={0.2}
                    wireframe
                    transparent
                    opacity={0.15}
                />
            </mesh>

            {/* Ring 1 */}
            <Torus ref={ring1} args={[2.3, 0.018, 2, 128]}>
                <meshStandardMaterial
                    color="#39FF14"
                    emissive="#39FF14"
                    emissiveIntensity={4}
                    transparent
                    opacity={0.9}
                />
            </Torus>

            {/* Ring 2 */}
            <Torus ref={ring2} args={[3.0, 0.01, 2, 128]} rotation={[Math.PI / 2.5, 0, 0]}>
                <meshStandardMaterial
                    color="#39FF14"
                    emissive="#39FF14"
                    emissiveIntensity={2}
                    transparent
                    opacity={0.6}
                />
            </Torus>

            {/* Lights */}
            <pointLight color="#39FF14" intensity={12} distance={15} />
            <pointLight color="#39FF14" intensity={5} distance={30} position={[3, 2, 2]} />
            <ambientLight intensity={0.05} />
        </group>
    );
}

// ─── Floating Particles ──────────────────────────────────────────────────────
function ParticleField() {
    const count = 1800;
    const ref = useRef<THREE.Points>(null);

    const positions = useMemo(() => {
        const arr = new Float32Array(count * 3);
        for (let i = 0; i < count; i++) {
            arr[i * 3] = (Math.random() - 0.5) * 28;
            arr[i * 3 + 1] = (Math.random() - 0.5) * 18;
            arr[i * 3 + 2] = (Math.random() - 0.5) * 20 - 8;
        }
        return arr;
    }, []);

    useFrame(({ clock }) => {
        if (ref.current) {
            ref.current.rotation.y = clock.elapsedTime * 0.012;
            ref.current.rotation.x = Math.sin(clock.elapsedTime * 0.005) * 0.1;
        }
    });

    return (
        <Points ref={ref} positions={positions}>
            <PointMaterial
                size={0.045}
                color="#39FF14"
                sizeAttenuation
                transparent
                opacity={0.7}
                depthWrite={false}
            />
        </Points>
    );
}

// ─── Wireframe Grid Floor ────────────────────────────────────────────────────
function GridFloor() {
    const ref = useRef<THREE.Mesh>(null);
    useFrame(({ clock }) => {
        if (ref.current) {
            ref.current.position.z = ((clock.elapsedTime * 1.2) % 4) - 2;
        }
    });
    return (
        <mesh ref={ref} rotation={[-Math.PI / 2, 0, 0]} position={[0, -3.5, -4]}>
            <planeGeometry args={[40, 40, 28, 28]} />
            <meshBasicMaterial color="#39FF14" wireframe transparent opacity={0.08} />
        </mesh>
    );
}

// ─── Full scene with offscreen render + ASCII pass ───────────────────────────
function SceneWithAscii() {
    const { gl, size, camera } = useThree();

    const renderTarget = useMemo(
        () =>
            new THREE.WebGLRenderTarget(size.width, size.height, {
                minFilter: THREE.LinearFilter,
                magFilter: THREE.LinearFilter,
                format: THREE.RGBAFormat,
                stencilBuffer: false,
            }),
        // eslint-disable-next-line react-hooks/exhaustive-deps
        []
    );

    // Scene that's rendered offscreen
    const offscreenScene = useMemo(() => {
        const s = new THREE.Scene();
        s.background = new THREE.Color("#0d0d0d");
        return s;
    }, []);

    // Orthographic camera for the fullscreen quad
    const orthoCamera = useMemo(
        () => new THREE.OrthographicCamera(-1, 1, 1, -1, 0, 10),
        []
    );

    const asciiMatRef = useRef<any>(null);

    useFrame(({ clock }) => {
        // Render the 3D scene to texture
        gl.setRenderTarget(renderTarget);
        gl.render(offscreenScene, camera);
        gl.setRenderTarget(null);

        if (asciiMatRef.current) {
            asciiMatRef.current.tDiffuse = renderTarget.texture;
            asciiMatRef.current.time = clock.elapsedTime;
            asciiMatRef.current.resolution.set(size.width, size.height);
        }
    });

    return (
        <>
            {/* Render 3D objects into offscreen scene via portals */}
            <primitive object={offscreenScene}>
                <OrbScene />
                <ParticleField />
                <GridFloor />
            </primitive>

            {/* Fullscreen ASCII quad */}
            <mesh renderOrder={999}>
                <planeGeometry args={[2, 2]} />
                <asciiMaterial
                    ref={asciiMatRef}
                    tDiffuse={renderTarget.texture}
                    resolution={new THREE.Vector2(size.width, size.height)}
                    cellSize={5}
                    depthTest={false}
                    depthWrite={false}
                />
            </mesh>
        </>
    );
}

// ─── Exports ─────────────────────────────────────────────────────────────────
export default function HeroScene() {
    return (
        <Canvas
            camera={{ position: [0, 0.5, 7], fov: 55 }}
            style={{ background: "transparent" }}
            gl={{
                alpha: true,
                antialias: false,
                powerPreference: "high-performance",
                toneMapping: THREE.NoToneMapping,
            }}
            dpr={[1, 1.5]}
        >
            <OrbScene />
            <ParticleField />
            <GridFloor />
            {/* Scanline/CRT overlay via a separate screen-space plane */}
            <ScanlineOverlay />
        </Canvas>
    );
}

// ─── CRT Scanline overlay (pure GLSL, no render target needed) ─────────────
const ScanlineMaterial = shaderMaterial(
    { time: 0 },
    `varying vec2 vUv; void main() { vUv = uv; gl_Position = projectionMatrix * modelViewMatrix * vec4(position,1.); }`,
    `
    uniform float time;
    varying vec2 vUv;
    
    float rand(float n){ return fract(sin(n) * 43758.5453); }
    
    void main() {
      // Scanlines
      float lines = sin(vUv.y * 800.0) * 0.5 + 0.5;
      float dark = mix(0.96, 1.0, lines);
      
      // Vignette
      vec2 centered = vUv * 2.0 - 1.0;
      float vignette = 1.0 - dot(centered, centered) * 0.35;

      // Occasional glitch line
      float glitch = step(0.998, rand(floor(time * 6.0) + vUv.y * 100.0));
      float alpha = (1.0 - dark * vignette) * 0.45 + glitch * 0.06;
      
      gl_FragColor = vec4(0.0, 0.0, 0.0, clamp(alpha, 0.0, 0.7));
    }
  `
);
extend({ ScanlineMaterial });

declare module "@react-three/fiber" {
    interface ThreeElements {
        scanlineMaterial: any;
    }
}

function ScanlineOverlay() {
    const ref = useRef<any>(null);
    const { camera } = useThree();

    useFrame(({ clock }) => {
        if (ref.current) ref.current.time = clock.elapsedTime;
    });

    return (
        <mesh
            renderOrder={100}
            // Position it in front of everything in camera space
            position={[0, 0, -0.5]}
            onPointerMove={undefined}
        >
            <planeGeometry args={[100, 100]} />
            <scanlineMaterial ref={ref} transparent depthTest={false} depthWrite={false} />
        </mesh>
    );
}
