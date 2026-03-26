"use client";

import { useRef } from "react";
import { motion, useInView } from "framer-motion";

export default function SectionDivider({ accent = false }: { accent?: boolean }) {
    const ref = useRef(null);
    const inView = useInView(ref, { once: true, margin: "-20px" });

    return (
        <div ref={ref} className="relative py-2 overflow-hidden">
            <motion.div
                initial={{ scaleX: 0, opacity: 0 }}
                animate={inView ? { scaleX: 1, opacity: 1 } : {}}
                transition={{ duration: 1.2, ease: [0.22, 1, 0.36, 1] }}
                style={{ originX: 0.5 }}
                className={`h-[1px] mx-auto ${accent ? "max-w-lg" : "max-w-xs"}`}
            >
                <div className="h-full w-full bg-gradient-to-r from-transparent via-[#39FF14]/30 to-transparent" />
            </motion.div>
            {accent && (
                <motion.div
                    initial={{ scale: 0, opacity: 0 }}
                    animate={inView ? { scale: 1, opacity: 1 } : {}}
                    transition={{ delay: 0.5, duration: 0.4, type: "spring", stiffness: 300 }}
                    className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-2 h-2 bg-[#39FF14] rotate-45"
                />
            )}
        </div>
    );
}
