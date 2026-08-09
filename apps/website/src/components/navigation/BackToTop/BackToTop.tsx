'use client';

import { useEffect, useState } from 'react';

import { AnimatePresence, motion, useReducedMotion } from 'motion/react';

import { ArrowUp } from '@vellira-ui/icons';

import styles from './BackToTop.module.css';

export function BackToTop() {
  const shouldReduceMotion = useReducedMotion();
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const updateVisibility = () => {
      setIsVisible(window.scrollY > 640);
    };

    updateVisibility();
    window.addEventListener('scroll', updateVisibility, { passive: true });

    return () => {
      window.removeEventListener('scroll', updateVisibility);
    };
  }, []);

  const handleClick = () => {
    window.scrollTo({
      top: 0,
      behavior: shouldReduceMotion ? 'auto' : 'smooth',
    });
  };

  return (
    <AnimatePresence>
      {isVisible ? (
        <motion.button
          type='button'
          className={styles.button}
          onClick={handleClick}
          aria-label='Back to top'
          initial={
            shouldReduceMotion
              ? { opacity: 0 }
              : { opacity: 0, y: 18, scale: 0.86 }
          }
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={
            shouldReduceMotion
              ? { opacity: 0 }
              : { opacity: 0, y: 14, scale: 0.9 }
          }
          whileHover={shouldReduceMotion ? undefined : { y: -3, scale: 1.04 }}
          whileTap={shouldReduceMotion ? undefined : { scale: 0.96 }}
          transition={{
            duration: shouldReduceMotion ? 0.12 : 0.28,
            ease: [0.16, 1, 0.3, 1],
          }}
        >
          <ArrowUp size={18} aria-hidden='true' />
        </motion.button>
      ) : null}
    </AnimatePresence>
  );
}

BackToTop.displayName = 'BackToTop';
