'use client';

import { motion, AnimatePresence, useInView } from 'framer-motion';
import { useRef } from 'react';
import type { ReactNode } from 'react';

interface FadeInStaggerProps {
  children: ReactNode;
  className?: string;
}

/**
 * Wrap a group of FadeInItem as parent.
 * AnimatePresence allows items to animate out smoothly when removed
 * (e.g. via "Show Less").
 */
export function FadeInStagger({ children, className }: FadeInStaggerProps) {
  return (
    <div className={className}>
      <AnimatePresence initial={false}>{children}</AnimatePresence>
    </div>
  );
}

interface FadeInItemProps {
  children: ReactNode;
  className?: string;
  index?: number;
}

/**
 * Each item animates in (fade + slide up) once when it enters viewport,
 * and animates out smoothly (fade + slide down) when removed
 * (e.g. via "Show Less"). Uses useInView + animate (not whileInView)
 * so the exit animation isn't fought by viewport re-evaluation.
 */
export function FadeInItem({
  children,
  className,
  index = 0,
}: FadeInItemProps) {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, amount: 0.15 });

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 60 }}
      animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 60 }}
      exit={{
        opacity: 0,
        y: 40,
        transition: { duration: 0.6, ease: [0.25, 0.1, 0.25, 1] },
      }}
      transition={{
        duration: 1,
        delay: Math.min(index * 0.15, 0.6),
        ease: [0.25, 0.1, 0.25, 1],
      }}
      className={className}
    >
      {children}
    </motion.div>
  );
}
