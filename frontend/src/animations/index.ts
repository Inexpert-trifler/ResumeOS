/**
 * Animations barrel export
 * 
 * Exports both React animation components AND raw Framer Motion variants.
 * 
 * Component usage: import { FadeUp, HoverLift } from '@/animations';
 * Variant usage:   import { fadeUpVariant, staggerContainerVariant } from '@/animations';
 */

// Animation Components
export * from './FadeUp';
export * from './StaggerAnimation';
export * from './HoverLift';
export * from './MagneticButton';
export * from './TextReveal';
export * from './ScrollReveal';

// Raw Framer Motion Variants (for use with motion.div, etc.)
export * from './variants';
