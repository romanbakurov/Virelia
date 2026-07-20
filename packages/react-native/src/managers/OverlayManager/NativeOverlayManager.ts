let stack: string[] = [];

export const nativeOverlayManager = {
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
};
