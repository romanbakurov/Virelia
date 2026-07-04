import { overlay } from '@vellira-ui/tokens';
import { StyleSheet } from 'react-native';

import type { NativeTheme } from '../../../theme';

export const createStyles = (theme: NativeTheme) =>
  StyleSheet.create({
    modalRoot: {
      flex: 1,
      justifyContent: 'flex-end',
    },

    backdrop: {
      ...StyleSheet.absoluteFill,
      backgroundColor: overlay.backdrop,
    },

    menu: {
      maxHeight: '50%',
      overflow: 'hidden',
      padding: theme.tokens.spacing[1],
      backgroundColor: theme.components.dropdown.content.bg,
      borderColor: theme.components.dropdown.content.border,
      borderTopLeftRadius: theme.tokens.radius.lg,
      borderTopRightRadius: theme.tokens.radius.lg,
      borderWidth: 1,
    },
  });
