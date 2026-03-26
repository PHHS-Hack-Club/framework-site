import type { Variants } from "framer-motion";
import type { Easing } from "framer-motion";

const easeOut: Easing = [0.22, 1, 0.36, 1];
const easeOutBack: Easing = [0.34, 1.56, 0.64, 1];

// ─── Basic Reveals ────────────────────────────────────────────────────────────

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
    hidden: { opacity: 0, y: 60, scale: 0.96, filter: "blur(16px)" },
    show: {
        opacity: 1,
        y: 0,
        scale: 1,
        filter: "blur(0px)",
        transition: { duration: 0.95, ease: easeOut },
    },
};

export const fadeDown: Variants = {
    hidden: { opacity: 0, y: -40, filter: "blur(8px)" },
    show: {
        opacity: 1,
        y: 0,
        filter: "blur(0px)",
        transition: { duration: 0.7, ease: easeOut },
    },
};

// ─── Directional Slides ───────────────────────────────────────────────────────

export const slideFromLeft: Variants = {
    hidden: { opacity: 0, x: -80, filter: "blur(8px)" },
    show: {
        opacity: 1,
        x: 0,
        filter: "blur(0px)",
        transition: { duration: 0.85, ease: easeOut },
    },
};

export const slideFromRight: Variants = {
    hidden: { opacity: 0, x: 80, filter: "blur(8px)" },
    show: {
        opacity: 1,
        x: 0,
        filter: "blur(0px)",
        transition: { duration: 0.85, ease: easeOut },
    },
};

// ─── Scale Reveals ────────────────────────────────────────────────────────────

export const scaleUp: Variants = {
    hidden: { opacity: 0, scale: 0.85, filter: "blur(12px)" },
    show: {
        opacity: 1,
        scale: 1,
        filter: "blur(0px)",
        transition: { duration: 0.75, ease: easeOutBack },
    },
};

export const scaleIn: Variants = {
    hidden: { opacity: 0, scale: 0.6, rotate: -3 },
    show: {
        opacity: 1,
        scale: 1,
        rotate: 0,
        transition: { duration: 0.7, ease: easeOutBack },
    },
};

// ─── Line / Divider Reveals ───────────────────────────────────────────────────

export const revealLine: Variants = {
    hidden: { scaleX: 0, opacity: 0 },
    show: {
        scaleX: 1,
        opacity: 1,
        transition: { duration: 1.2, ease: easeOut },
    },
};

// ─── Card Fan ─────────────────────────────────────────────────────────────────

export const cardFan: Variants = {
    hidden: { opacity: 0, y: 60, rotateX: 12, scale: 0.92, filter: "blur(6px)" },
    show: {
        opacity: 1,
        y: 0,
        rotateX: 0,
        scale: 1,
        filter: "blur(0px)",
        transition: { duration: 0.8, ease: easeOut },
    },
};

// ─── Stagger Containers ──────────────────────────────────────────────────────

export const stagger: Variants = {
    hidden: {},
    show: { transition: { delayChildren: 0.08, staggerChildren: 0.12 } },
};

export const staggerFast: Variants = {
    hidden: {},
    show: { transition: { delayChildren: 0.04, staggerChildren: 0.09 } },
};

export const staggerSlow: Variants = {
    hidden: {},
    show: { transition: { delayChildren: 0.15, staggerChildren: 0.18 } },
};

export const staggerWide: Variants = {
    hidden: {},
    show: { transition: { delayChildren: 0.1, staggerChildren: 0.25 } },
};

// ─── Page Transition ──────────────────────────────────────────────────────────

export const pageTransition: Variants = {
    initial: { opacity: 0, y: 20, filter: "blur(8px)" },
    enter: {
        opacity: 1,
        y: 0,
        filter: "blur(0px)",
        transition: { duration: 0.5, ease: easeOut },
    },
    exit: {
        opacity: 0,
        y: -20,
        filter: "blur(8px)",
        transition: { duration: 0.3, ease: "easeIn" },
    },
};

// ─── Reveal with Clip Path ────────────────────────────────────────────────────

export const clipReveal: Variants = {
    hidden: { clipPath: "inset(100% 0% 0% 0%)" },
    show: {
        clipPath: "inset(0% 0% 0% 0%)",
        transition: { duration: 0.9, ease: easeOut },
    },
};

export const clipRevealLeft: Variants = {
    hidden: { clipPath: "inset(0% 100% 0% 0%)" },
    show: {
        clipPath: "inset(0% 0% 0% 0%)",
        transition: { duration: 0.9, ease: easeOut },
    },
};
