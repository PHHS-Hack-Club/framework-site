"use client";

import { useEffect } from "react";
import Lenis from "lenis";

export default function SmoothScrollProvider({ children }: { children: React.ReactNode }) {
    useEffect(() => {
        const lenis = new Lenis({
            duration: 1.2,
            easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
            orientation: "vertical",
            smoothWheel: true,
            touchMultiplier: 2.0,
        });

        let raf: number;
        function raf_loop(time: number) {
            lenis.raf(time);
            raf = requestAnimationFrame(raf_loop);
        }
        raf = requestAnimationFrame(raf_loop);

        // Make anchor links work with Lenis
        document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
            anchor.addEventListener("click", (e) => {
                e.preventDefault();
                const target = document.querySelector((anchor as HTMLAnchorElement).hash);
                if (target) lenis.scrollTo(target as HTMLElement, { offset: -80, duration: 1.4 });
            });
        });

        return () => {
            cancelAnimationFrame(raf);
            lenis.destroy();
        };
    }, []);

    return <>{children}</>;
}
