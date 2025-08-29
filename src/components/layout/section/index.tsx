'use client';

import { cn } from '@/lib/utils/cn';
import { motion, MotionProps } from 'motion/react';

type PaddingSizes = 'small' | 'medium' | 'large';

type SectionProps = {
  children: React.ReactNode;
  className?: string;
  id?: string;
  isFullWidth?: boolean;
  paddingTop?: PaddingSizes;
  paddingBottom?: PaddingSizes;
  animateOnScroll?: boolean;
};

export const Section = ({
  children,
  className,
  id,
  paddingTop,
  paddingBottom,
  isFullWidth = false,
  animateOnScroll = false,
}: SectionProps) => {
  const sectionClasses = cn(
    {
      container: !isFullWidth,
      'w-full': isFullWidth,
      'pt-16': paddingTop === 'medium',
      'pb-16': paddingBottom === 'medium',
      'pt-8': paddingTop === 'small',
      'pt-24': paddingTop === 'large',
      'pb-8': paddingBottom === 'small',
      'pb-24': paddingBottom === 'large',
    },
    className,
  );

  const motionProps: MotionProps = {
    initial: { opacity: 0, y: 50 },
    whileInView: { opacity: 1, y: 0 },
    transition: { duration: 0.4, delay: 0.2 },
    viewport: { once: true, margin: '-75px' },
  };

  const sectionProps = {
    id,
    className: sectionClasses,
  };

  return (
    <>
      {animateOnScroll ? (
        <motion.section {...sectionProps} {...motionProps}>
          {children}
        </motion.section>
      ) : (
        <section {...sectionProps}>{children}</section>
      )}
    </>
  );
};
