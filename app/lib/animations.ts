import type { Variants } from "framer-motion";
import type { Easing } from "framer-motion";

const easeOut: Easing = "easeOut";

export const fadeUp: Variants = {
    hidden: { opacity: 0, y: 40 },
    show: {
        opacity: 1,
        y: 0,
        transition: { duration: 0.7, ease: easeOut },
    },
};

export const fadeUpLarge: Variants = {
    hidden: { opacity: 0, y: 50 },
    show: {
        opacity: 1,
        y: 0,
        transition: { duration: 0.8, ease: easeOut },
    },
};

export const stagger: Variants = {
    hidden: {},
    show: { transition: { staggerChildren: 0.12 } },
};

export const staggerFast: Variants = {
    hidden: {},
    show: { transition: { staggerChildren: 0.1 } },
};
