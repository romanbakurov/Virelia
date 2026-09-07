/**
 * Legacy Web output identities retained by #884 only for compatibility.
 *
 * These paths are not canonical component tokens. They exist after the
 * renderer-neutral component boundary and are intentionally revisited by #889.
 */
export const componentTokenWebCompatibilityAliases = [
  {
    path: 'components.modal.content.nativeMaxHeight',
    variable: '--modal-content-native-max-height',
  },
  {
    path: 'components.popover.content.shadow.web',
    variable: '--popover-content-shadow-web',
  },
  {
    path: 'components.popover.content.shadow.native.x',
    variable: '--popover-content-shadow-native-x',
  },
  {
    path: 'components.popover.content.shadow.native.y',
    variable: '--popover-content-shadow-native-y',
  },
  {
    path: 'components.popover.content.shadow.native.blur',
    variable: '--popover-content-shadow-native-blur',
  },
  {
    path: 'components.popover.content.shadow.native.color',
    variable: '--popover-content-shadow-native-color',
  },
  {
    path: 'components.popover.content.shadow.native.opacity',
    variable: '--popover-content-shadow-native-opacity',
  },
  {
    path: 'components.popover.content.shadow.native.elevation',
    variable: '--popover-content-shadow-native-elevation',
  },
] as const;
