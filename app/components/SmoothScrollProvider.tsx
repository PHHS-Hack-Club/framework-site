"use client";

import { useEffect } from "react";
import Lenis from "lenis";
import { gsap } from "gsap";

export default function SmoothScrollProvider({ children }: { children: React.ReactNode }) {
    useEffect(() => {
        const lenis = new Lenis({
            duration: 1.2,
            easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
            orientation: "vertical",
            smoothWheel: true,
            touchMultiplier: 2.0,
        });

        // Drive Lenis from GSAP's ticker — eliminates a competing RAF loop
        const tick = (time: number) => lenis.raf(time * 1000);
        gsap.ticker.add(tick);
        gsap.ticker.lagSmoothing(0);

        // Make anchor links work with Lenis
        document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
            anchor.addEventListener("click", (e) => {
                e.preventDefault();
                const target = document.querySelector((anchor as HTMLAnchorElement).hash);
                if (target) lenis.scrollTo(target as HTMLElement, { offset: -80, duration: 1.4 });
            });
        });

        return () => {
            gsap.ticker.remove(tick);
            lenis.destroy();
        };
    }, []);

    return <>{children}</>;
}
