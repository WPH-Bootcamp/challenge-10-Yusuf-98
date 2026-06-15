'use client';

import { motion, AnimatePresence, useInView } from 'framer-motion';
import { useRef } from 'react';
import { FadeInStaggerProps, FadeInItemProps } from '@/types';

export function FadeInStagger({ children, className }: FadeInStaggerProps) {
  return (
    <div className={className}>
      <AnimatePresence initial={false}>{children}</AnimatePresence>
    </div>
  );
}

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
