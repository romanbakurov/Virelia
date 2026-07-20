import { useEffect } from 'react';

let scrollLockCount = 0;
let originalBodyOverflow = '';

const scrollLockStore = {
  lock() {
    if (typeof document === 'undefined') return;

    if (scrollLockCount === 0) {
      originalBodyOverflow = document.body.style.overflow;
      document.body.style.overflow = 'hidden';
    }

    scrollLockCount += 1;
  },
  unlock() {
    if (typeof document === 'undefined') return;

    scrollLockCount = Math.max(0, scrollLockCount - 1);

    if (scrollLockCount === 0) {
      document.body.style.overflow = originalBodyOverflow;
    }
  },
};

export type ScrollLockOptions = {
  active: boolean;
  enabled?: boolean;
};

export const useScrollLock = ({
  active,
  enabled = true,
}: ScrollLockOptions) => {
  useEffect(() => {
    if (!active || !enabled) return;

    scrollLockStore.lock();

    return () => {
      scrollLockStore.unlock();
    };
  }, [active, enabled]);
};
