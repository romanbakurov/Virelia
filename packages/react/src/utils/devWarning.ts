export const devWarning = (condition: boolean, message: string) => {
  if (process.env.NODE_ENV !== 'production' && !condition) {
    console.warn(message);
  }
};
