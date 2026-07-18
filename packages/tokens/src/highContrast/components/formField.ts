import { radius } from '../../tokens/radius.js';
import { spacing } from '../../tokens/spacing.js';
import { typography } from '../../tokens/typography.js';
import { status } from '../semantic/status.js';
import { text } from '../semantic/text.js';

export const formField = {
  label: {
    fg: text.primary,
  },

  optional: {
    fg: text.secondary,
  },

  labelInfo: {
    fg: text.secondary,
    border: text.secondary,
    radius: radius.full,
  },

  description: {
    fg: text.secondary,
  },

  helperText: {
    default: {
      fg: text.muted,
    },

    error: {
      fg: status.error.fg,
    },

    success: {
      fg: status.success.fg,
    },

    warning: {
      fg: status.warning.fg,
    },

    info: {
      fg: status.info.fg,
    },
  },

  requiredMark: {
    fg: status.error.fg,
  },

  disabled: {
    labelFg: text.disabled,
    descriptionFg: text.disabled,
    helperTextFg: text.disabled,
  },

  size: {
    sm: {
      gap: spacing[1],
      horizontalGap: spacing[3],
      labelFontSize: typography.size.sm,
      labelLineHeight: typography.lineHeight.sm,
      descriptionFontSize: typography.size.xs,
      descriptionLineHeight: typography.lineHeight.xs,
      helperTextFontSize: typography.size.xs,
      helperTextLineHeight: typography.lineHeight.xs,
      optionalFontSize: typography.size.xs,
      optionalLineHeight: typography.lineHeight.xs,
      labelInfoSize: spacing[4],
      labelInfoFontSize: typography.size.xs,
    },
    md: {
      gap: spacing[2],
      horizontalGap: spacing[4],
      labelFontSize: typography.size.md,
      labelLineHeight: typography.lineHeight.md,
      descriptionFontSize: typography.size.sm,
      descriptionLineHeight: typography.lineHeight.sm,
      helperTextFontSize: typography.size.sm,
      helperTextLineHeight: typography.lineHeight.sm,
      optionalFontSize: typography.size.xs,
      optionalLineHeight: typography.lineHeight.xs,
      labelInfoSize: spacing[4],
      labelInfoFontSize: typography.size.xs,
    },
    lg: {
      gap: spacing[3],
      horizontalGap: spacing[5],
      labelFontSize: typography.size.lg,
      labelLineHeight: typography.lineHeight.lg,
      descriptionFontSize: typography.size.md,
      descriptionLineHeight: typography.lineHeight.md,
      helperTextFontSize: typography.size.md,
      helperTextLineHeight: typography.lineHeight.md,
      optionalFontSize: typography.size.sm,
      optionalLineHeight: typography.lineHeight.sm,
      labelInfoSize: spacing[5],
      labelInfoFontSize: typography.size.sm,
    },
  },
} as const;
