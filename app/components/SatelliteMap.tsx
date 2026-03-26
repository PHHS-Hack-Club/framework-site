"use client";

import { useEffect, useRef } from "react";

// Pascack Hills High School
const LAT = 41.04938141595906;
const LNG = -74.04945707354774;
const ZOOM = 18;

export default function SatelliteMap() {
    const containerRef = useRef<HTMLDivElement>(null);
    const mapRef = useRef<ReturnType<typeof import("leaflet")["map"]> | null>(null);

    useEffect(() => {
        if (!containerRef.current || mapRef.current) return;

        let L: typeof import("leaflet");

        (async () => {
            L = (await import("leaflet")).default;

            // Leaflet CSS
            if (!document.getElementById("leaflet-css")) {
                const link = document.createElement("link");
                link.id = "leaflet-css";
                link.rel = "stylesheet";
                link.href = "https://unpkg.com/leaflet@1.9.4/dist/leaflet.css";
                document.head.appendChild(link);
            }

            const map = L.map(containerRef.current!, {
                center: [LAT, LNG],
                zoom: ZOOM,
                zoomControl: false,
                attributionControl: false,
                scrollWheelZoom: false,
                dragging: false,
                doubleClickZoom: false,
            });

            mapRef.current = map;

            // ESRI World Imagery — free, no API key
            // tileSize 128 + zoomOffset 1 loads coarser tiles → pixel-art look
            L.tileLayer(
                "https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}",
                { maxZoom: 20, tileSize: 128, zoomOffset: 1, className: "pixel-tiles" }
            ).addTo(map);

            // Neon green crosshair marker using DivIcon
            const icon = L.divIcon({
                className: "",
                html: `
                    <div style="position:relative;width:32px;height:32px;">
                        <div style="position:absolute;inset:0;border:2px solid #39FF14;border-radius:50%;animation:ping 1.4s ease-out infinite;opacity:0.5;"></div>
                        <div style="position:absolute;inset:8px;background:#39FF14;border-radius:50%;box-shadow:0 0 14px #39FF14,0 0 28px rgba(57,255,20,0.5);"></div>
                    </div>
                    <style>@keyframes ping{0%{transform:scale(1);opacity:.5}100%{transform:scale(2.2);opacity:0}}</style>
                `,
                iconSize: [32, 32],
                iconAnchor: [16, 16],
            });

            L.marker([LAT, LNG], { icon }).addTo(map);
        })();

        return () => {
            mapRef.current?.remove();
            mapRef.current = null;
        };
    }, []);

    return (
        <div className="relative w-full aspect-square border border-outline-variant/20 overflow-hidden group">
            <div ref={containerRef} className="w-full h-full" style={{ filter: "brightness(0.8) saturate(0.6) contrast(1.1)" }} />

            {/* subtle green tint */}
            <div className="absolute inset-0 pointer-events-none" style={{ background: "rgba(57,255,20,0.10)", mixBlendMode: "overlay" }} />

            {/* scanning line */}
            <div
                className="absolute left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-[#39FF14]/50 to-transparent pointer-events-none"
                style={{ animation: "scanDown 4s linear infinite" }}
            />

            {/* coordinate HUD */}
            <div className="absolute top-4 left-4 bg-[#0a0a0a]/90 backdrop-blur-sm p-3 border-l-2 border-[#39FF14] z-[1000] pointer-events-none">
                <div className="font-mono text-[10px] text-on-surface-variant mb-1 tracking-widest uppercase">
                    TARGET_COORDINATES
                </div>
                <div className="font-mono text-base text-[#39FF14] font-bold" style={{ textShadow: "0 0 8px #39FF14" }}>
                    41.0494° N, 74.0495° W
                </div>
            </div>

            {/* corner brackets */}
            <div className="absolute top-2 right-2 w-6 h-6 border-t-2 border-r-2 border-[#39FF14]/40 pointer-events-none" />
            <div className="absolute bottom-2 left-2 w-6 h-6 border-b-2 border-l-2 border-[#39FF14]/40 pointer-events-none" />

            <style>{`
                @keyframes scanDown { 0% { top: 0%; } 100% { top: 100%; } }
                .pixel-tiles img {
                    image-rendering: pixelated;
                    image-rendering: crisp-edges;
                }
            `}</style>
        </div>
    );
}
