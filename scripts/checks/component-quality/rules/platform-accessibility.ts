import fs from 'node:fs';
import path from 'node:path';

import type {
  ComponentMetadata,
  ComponentPlatform,
  ComponentQualityFinding,
} from '@vellira-ui/metadata';

import { qualityRoot } from '../root';

import type {
  ComponentQualityRule,
  ComponentQualityRuleContext,
} from '../types';

function platformPackage(platform: ComponentPlatform) {
  return platform === 'react' ? 'react' : 'react-native';
}

function componentDirectory(
  root: string,
  metadata: ComponentMetadata,
  platform: ComponentPlatform
) {
  return path.join(
    root,
    'packages',
    platformPackage(platform),
    'src',
    metadata.layer,
    metadata.name
  );
}

function shouldIncludeSourceFile(fileName: string) {
  return (
    /\.(ts|tsx)$/.test(fileName) &&
    !/(\.test|\.stories|\.spec)\.(ts|tsx)$/.test(fileName)
  );
}

function collectSourceFiles(directory: string): string[] {
  if (!fs.existsSync(directory)) return [];

  return fs
    .readdirSync(directory, { withFileTypes: true })
    .flatMap((entry) => {
      const fullPath = path.join(directory, entry.name);

      if (entry.isDirectory()) {
        return collectSourceFiles(fullPath);
      }

      return shouldIncludeSourceFile(entry.name) ? [fullPath] : [];
    })
    .sort((left, right) => left.localeCompare(right));
}

function readComponentSource(context: ComponentQualityRuleContext) {
  const root = qualityRoot(context);
  const componentDir = componentDirectory(
    root,
    context.metadata,
    context.platform
  );
  const files = collectSourceFiles(componentDir);

  return {
    componentDir,
    files,
    source: files.map((file) => fs.readFileSync(file, 'utf8')).join('\n'),
  };
}

function finding(
  rule: ComponentQualityRule,
  context: ComponentQualityRuleContext,
  status: ComponentQualityFinding['status'],
  message?: string,
  evidence?: readonly string[]
): ComponentQualityFinding {
  return {
    ruleId: rule.definition.id,
    dimension: rule.definition.dimension,
    severity: rule.definition.severity,
    evaluation: rule.definition.evaluation,
    status,
    platform: context.platform,
    message,
    evidence,
  };
}

function relativeEvidence(
  context: ComponentQualityRuleContext,
  files: readonly string[]
) {
  return files
    .slice(0, 4)
    .map((file) => path.relative(qualityRoot(context), file));
}

const webSemanticEvidence = [
  /<button\b/,
  /<input\b/,
  /<select\b/,
  /<textarea\b/,
  /<a\b/,
  /\brole\s*=/,
  /\baria-[a-z-]+\s*=/,
];

const nativeAccessibilityEvidence = [
  /\baccessibilityRole\s*=/,
  /\baccessibilityLabel\s*=/,
  /\baccessibilityState\s*=/,
  /\baccessibilityHint\s*=/,
  /\baccessible\s*=/,
];

export const accessibilitySemanticsRule: ComponentQualityRule = {
  definition: {
    id: 'platform.accessibility-semantics',
    dimension: 'accessibility',
    severity: 'required',
    evaluation: 'automated',
    description:
      'Checks platform-appropriate deterministic accessibility semantics when accessibility is required.',
  },
  evaluate(context) {
    if (!context.metadata.requirements.accessibility) {
      return finding(accessibilitySemanticsRule, context, 'not-applicable');
    }

    const snapshot = readComponentSource(context);
    const patterns =
      context.platform === 'react'
        ? webSemanticEvidence
        : nativeAccessibilityEvidence;
    const hasEvidence = patterns.some((pattern) =>
      pattern.test(snapshot.source)
    );

    if (hasEvidence) {
      return finding(
        accessibilitySemanticsRule,
        context,
        'pass',
        undefined,
        relativeEvidence(context, snapshot.files)
      );
    }

    return finding(
      accessibilitySemanticsRule,
      context,
      'fail',
      context.platform === 'react'
        ? 'Accessibility is required, but no semantic element, role, or ARIA evidence was found.'
        : 'Accessibility is required, but no React Native accessibilityRole/Label/State/accessible evidence was found.',
      [path.relative(qualityRoot(context), snapshot.componentDir)]
    );
  },
};

const webKeyboardEvidence = [
  /\bonKeyDown\b/,
  /\bonKeyUp\b/,
  /\bKeyboardEvent\b/,
  /\buseKeyboardNavigation\b/,
  /\bhandleKeyDown\b/,
  /\bcloseOnEscape\s*:\s*true\b/,
];

const nativeInteractionEvidence = [
  /\bonPress\b/,
  /\bPressable\b/,
  /\bTouchable(?:Opacity|Highlight|WithoutFeedback)\b/,
  /\bGestureDetector\b/,
  /<(?:Radio|Button|Checkbox)\b/,
];

export const platformInteractionRule: ComponentQualityRule = {
  definition: {
    id: 'platform.interaction',
    dimension: 'interaction',
    severity: 'required',
    evaluation: 'automated',
    description:
      'Checks keyboard behavior on web and equivalent platform-appropriate interaction evidence on React Native.',
  },
  evaluate(context) {
    const capabilities = context.metadata.capabilities ?? [];

    if (!capabilities.includes('keyboard')) {
      return finding(platformInteractionRule, context, 'not-applicable');
    }

    const snapshot = readComponentSource(context);
    const patterns =
      context.platform === 'react'
        ? webKeyboardEvidence
        : nativeInteractionEvidence;
    const hasEvidence = patterns.some((pattern) =>
      pattern.test(snapshot.source)
    );

    return hasEvidence
      ? finding(
          platformInteractionRule,
          context,
          'pass',
          undefined,
          relativeEvidence(context, snapshot.files)
        )
      : finding(
          platformInteractionRule,
          context,
          'fail',
          context.platform === 'react'
            ? 'Keyboard capability is declared, but no deterministic keyboard interaction evidence was found.'
            : 'Keyboard/interaction capability is declared, but no platform-appropriate React Native press/gesture interaction evidence was found.',
          [path.relative(qualityRoot(context), snapshot.componentDir)]
        );
  },
};

const webFocusEvidence = [
  /\.focus\(/,
  /\bautoFocus\b/,
  /\bonFocus\b/,
  /\bonBlur\b/,
  /\bfocusRef\b/,
  /\btriggerRef\b/,
  /\buseRef\b/,
];

const nativeFocusEvidence = [
  /\.focus\(/,
  /\bautoFocus\b/,
  /\bonFocus\b/,
  /\bonBlur\b/,
  /\bTextInput\b/,
  /\bref\s*=/,
  /\buseRef\b/,
];

export const focusManagementRule: ComponentQualityRule = {
  definition: {
    id: 'platform.focus-management',
    dimension: 'platform-quality',
    severity: 'required',
    evaluation: 'automated',
    description:
      'Checks platform-appropriate focus-management evidence when the capability is declared.',
  },
  evaluate(context) {
    if (!(context.metadata.capabilities ?? []).includes('focus-management')) {
      return finding(focusManagementRule, context, 'not-applicable');
    }

    const snapshot = readComponentSource(context);
    const patterns =
      context.platform === 'react' ? webFocusEvidence : nativeFocusEvidence;
    const hasEvidence = patterns.some((pattern) =>
      pattern.test(snapshot.source)
    );

    return hasEvidence
      ? finding(
          focusManagementRule,
          context,
          'pass',
          undefined,
          relativeEvidence(context, snapshot.files)
        )
      : finding(
          focusManagementRule,
          context,
          'fail',
          `Focus-management capability is declared, but no ${context.platform === 'react' ? 'web' : 'React Native'} focus evidence was found.`,
          [path.relative(qualityRoot(context), snapshot.componentDir)]
        );
  },
};

const webOverlayEvidence = [
  /\bcreatePortal\b/,
  /\bPortal\b/,
  /\bportal\b/i,
  /\bObject\.assign\b[\s\S]*\bOverlay\b[\s\S]*\bContent\b/,
];

const nativeOverlayEvidence = [
  /\bModal\b/,
  /\bPresentation\b/,
  /\bPortal\b/,
  /\bpresentation\b/i,
];

export const overlayPresentationRule: ComponentQualityRule = {
  definition: {
    id: 'platform.overlay-presentation',
    dimension: 'platform-quality',
    severity: 'required',
    evaluation: 'automated',
    description:
      'Checks platform-appropriate overlay presentation when portal capability is declared.',
  },
  evaluate(context) {
    if (!(context.metadata.capabilities ?? []).includes('portal')) {
      return finding(overlayPresentationRule, context, 'not-applicable');
    }

    const snapshot = readComponentSource(context);
    const patterns =
      context.platform === 'react' ? webOverlayEvidence : nativeOverlayEvidence;
    const hasEvidence = patterns.some((pattern) =>
      pattern.test(snapshot.source)
    );

    return hasEvidence
      ? finding(
          overlayPresentationRule,
          context,
          'pass',
          undefined,
          relativeEvidence(context, snapshot.files)
        )
      : finding(
          overlayPresentationRule,
          context,
          'fail',
          context.platform === 'react'
            ? 'Portal capability is declared, but no web portal or explicit compound overlay-presentation evidence was found.'
            : 'Portal capability is declared, but no React Native Modal/Presentation/Portal evidence was found.',
          [path.relative(qualityRoot(context), snapshot.componentDir)]
        );
  },
};

export const platformAccessibilityQualityRules: readonly ComponentQualityRule[] =
  [
    accessibilitySemanticsRule,
    platformInteractionRule,
    focusManagementRule,
    overlayPresentationRule,
  ];
