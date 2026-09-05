export { composeEventHandlers, composeRefs } from '#utils/compose';

export function toCssSize(value: number | string | undefined) {
  if (typeof value === 'number') return `${value}px`;

  return value;
}
