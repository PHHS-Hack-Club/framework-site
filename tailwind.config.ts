import type { Config } from "tailwindcss";

const config: Config = {
    darkMode: "class",
    content: [
        "./pages/**/*.{js,ts,jsx,tsx,mdx}",
        "./components/**/*.{js,ts,jsx,tsx,mdx}",
        "./app/**/*.{js,ts,jsx,tsx,mdx}",
    ],
    theme: {
        extend: {
            colors: {
                "surface-container-low": "#1c1b1b",
                "secondary-fixed": "#8dfc71",
                "tertiary-container": "#ffd3ce",
                "on-secondary": "#053900",
                "outline-variant": "#3c4b35",
                "inverse-primary": "#106e00",
                "on-background": "#e5e2e1",
                "surface-variant": "#353534",
                "surface-container-high": "#2a2a2a",
                "primary-fixed-dim": "#2ae500",
                outline: "#85967c",
                "error-container": "#93000a",
                "surface-dim": "#131313",
                "on-primary-fixed": "#022100",
                surface: "#131313",
                "on-surface": "#e5e2e1",
                "tertiary-fixed": "#ffdad6",
                "on-tertiary-fixed-variant": "#5d3f3c",
                "surface-container-highest": "#353534",
                "surface-bright": "#3a3939",
                "on-tertiary-fixed": "#2c1513",
                "on-tertiary": "#442927",
                error: "#ffb4ab",
                "on-primary-container": "#107100",
                "secondary-container": "#3aa625",
                "on-error": "#690005",
                "inverse-on-surface": "#313030",
                secondary: "#72de58",
                "primary-fixed": "#79ff5b",
                "on-surface-variant": "#baccb0",
                primary: "#efffe3",
                "on-primary-fixed-variant": "#095300",
                "inverse-surface": "#e5e2e1",
                "on-secondary-fixed": "#022100",
                "on-primary": "#053900",
                background: "#131313",
                "surface-container": "#201f1f",
                "secondary-fixed-dim": "#72de58",
                "primary-container": "#39ff14",
                "on-secondary-fixed-variant": "#095300",
                "surface-tint": "#2ae500",
                "on-tertiary-container": "#7a5955",
                "tertiary-fixed-dim": "#e7bdb8",
                "surface-container-lowest": "#0e0e0e",
                tertiary: "#fff8f7",
                "on-secondary-container": "#043200",
                "on-error-container": "#ffdad6",
                neonGreen: "#39FF14",
            },
            fontFamily: {
                headline: ["Space Grotesk", "sans-serif"],
                body: ["Space Grotesk", "sans-serif"],
                label: ["Space Grotesk", "sans-serif"],
                mono: ["JetBrains Mono", "monospace"],
            },
            borderRadius: {
                DEFAULT: "0px",
                lg: "0px",
                xl: "0px",
                full: "9999px",
            },
            keyframes: {
                blink: {
                    "50%": { opacity: "0" },
                },
                flicker: {
                    "0%, 19.999%, 22%, 62.999%, 64%, 64.999%, 70%, 100%": {
                        opacity: "1",
                    },
                    "20%, 21.999%, 63%, 63.999%, 65%, 69.999%": { opacity: "0.4" },
                },
                marquee: {
                    "0%": { transform: "translateX(0)" },
                    "100%": { transform: "translateX(-50%)" },
                },
                "glow-breathe": {
                    "0%, 100%": {
                        filter: "drop-shadow(0 0 5px rgba(57, 255, 20, 0.2))",
                    },
                    "50%": { filter: "drop-shadow(0 0 20px rgba(57, 255, 20, 0.6))" },
                },
                "pulse-glow": {
                    "0%, 100%": {
                        boxShadow: "0 0 20px rgba(57, 255, 20, 0.3)",
                    },
                    "50%": {
                        boxShadow: "0 0 40px rgba(57, 255, 20, 0.6)",
                    },
                },
            },
            animation: {
                blink: "blink 1s step-end infinite",
                flicker: "flicker 4s linear infinite",
                marquee: "marquee 30s linear infinite",
                "glow-breathe": "glow-breathe 3s ease-in-out infinite",
                "pulse-glow": "pulse-glow 3s ease-in-out infinite",
            },
            backgroundImage: {
                "grid-pattern":
                    "radial-gradient(#3c4b35 1px, transparent 1px)",
            },
            backgroundSize: {
                "grid-32": "32px 32px",
            },
        },
    },
    plugins: [],
};

export default config;
