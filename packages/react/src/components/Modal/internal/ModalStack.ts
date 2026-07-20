let stack: string[] = [];
let scrollLockCount = 0;
let originalBodyOverflow = '';

export const modalStack = {
  add(id: string) {
    stack = stack.filter((item) => item !== id);
    stack.push(id);
  },
  remove(id: string) {
    stack = stack.filter((item) => item !== id);
  },
  isTop(id: string) {
    return stack[stack.length - 1] === id;
  },
  lockScroll() {
    if (scrollLockCount === 0) {
      originalBodyOverflow = document.body.style.overflow;
      document.body.style.overflow = 'hidden';
    }

    scrollLockCount += 1;
  },
  unlockScroll() {
    scrollLockCount = Math.max(0, scrollLockCount - 1);

    if (scrollLockCount === 0) {
      document.body.style.overflow = originalBodyOverflow;
    }
  },
};
