import type { Variants } from "framer-motion";
import type { Easing } from "framer-motion";

const easeOut: Easing = [0.22, 1, 0.36, 1];

export const fadeUp: Variants = {
    hidden: { opacity: 0, y: 32, scale: 0.985, filter: "blur(10px)" },
    show: {
        opacity: 1,
        y: 0,
        scale: 1,
        filter: "blur(0px)",
        transition: { duration: 0.78, ease: easeOut },
    },
};

export const fadeUpLarge: Variants = {
    hidden: { opacity: 0, y: 44, scale: 0.97, filter: "blur(14px)" },
    show: {
        opacity: 1,
        y: 0,
        scale: 1,
        filter: "blur(0px)",
        transition: { duration: 0.9, ease: easeOut },
    },
};

export const stagger: Variants = {
    hidden: {},
    show: { transition: { delayChildren: 0.08, staggerChildren: 0.12 } },
};

export const staggerFast: Variants = {
    hidden: {},
    show: { transition: { delayChildren: 0.04, staggerChildren: 0.09 } },
};
