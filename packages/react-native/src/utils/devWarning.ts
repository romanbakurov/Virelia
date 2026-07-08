export const devWarning = (condition: boolean, message: string) => {
  if ((typeof __DEV__ === 'undefined' || __DEV__) && !condition) {
    console.warn(message);
  }
};
