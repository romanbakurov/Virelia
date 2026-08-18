import fs from 'node:fs';
import path from 'node:path';

import type {
  ComponentMetadata,
  ComponentPlatform,
  ComponentQualityFinding,
} from '@vellira-ui/metadata';

import type {
  ComponentQualityRule,
  ComponentQualityRuleContext,
} from '../types';

type SourceFile = {
  filePath: string;
  source: string;
};

type ConformityException = {
  ruleId: string;
  platform?: ComponentPlatform;
  filePattern?: RegExp;
  valuePattern?: RegExp;
  reason: string;
};

const exceptions: readonly ConformityException[] = [
  {
    ruleId: 'conformity.hardcoded-geometry',
    filePattern: /Button\.(?:module\.scss|styles\.ts)$/,
    valuePattern: /\b(?:1|2|4|6|8|11|12|16|18|24|32)(?:px)?\b/,
    reason:
      'Button V1 intentionally retains established geometry values until spacing-token migration is defined.',
  },
];

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

function isImplementationStyleFile(fileName: string) {
  return (
    /\.(?:ts|tsx|css|scss)$/.test(fileName) &&
    !/(?:\.test|\.stories|\.spec)\.(?:ts|tsx)$/.test(fileName)
  );
}

function collectFiles(directory: string): string[] {
  if (!fs.existsSync(directory)) return [];

  return fs
    .readdirSync(directory, { withFileTypes: true })
    .flatMap((entry) => {
      const fullPath = path.join(directory, entry.name);

      if (entry.isDirectory()) return collectFiles(fullPath);

      return isImplementationStyleFile(entry.name) ? [fullPath] : [];
    })
    .sort((a, b) => a.localeCompare(b));
}

function readFiles(context: ComponentQualityRuleContext): SourceFile[] {
  const directory = componentDirectory(
    process.cwd(),
    context.metadata,
    context.platform
  );

  return collectFiles(directory).map((filePath) => ({
    filePath,
    source: fs.readFileSync(filePath, 'utf8'),
  }));
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

function isExcepted(params: {
  ruleId: string;
  context: ComponentQualityRuleContext;
  filePath: string;
  value: string;
}) {
  return exceptions.some(
    (exception) =>
      exception.ruleId === params.ruleId &&
      (!exception.platform || exception.platform === params.context.platform) &&
      (!exception.filePattern ||
        exception.filePattern.test(path.basename(params.filePath))) &&
      (!exception.valuePattern || exception.valuePattern.test(params.value))
  );
}

function lineNumberAt(source: string, index: number) {
  return source.slice(0, index).split('\n').length;
}

function sourceEvidence(filePath: string, line: number, value: string) {
  return `${path.relative(process.cwd(), filePath)}:${line} — ${value}`;
}

const hardcodedColorPattern =
  /(?<![-\w])(?:#[0-9a-fA-F]{3,8}\b|rgba?\([^)]*\)|hsla?\([^)]*\))/g;

export const hardcodedColorRule: ComponentQualityRule = {
  definition: {
    id: 'conformity.hardcoded-color',
    dimension: 'design-system',
    severity: 'required',
    evaluation: 'automated',
    description:
      'Rejects hardcoded color literals in component implementation/style files where Vellira token/theme values should be used.',
  },
  evaluate(context) {
    const violations: string[] = [];

    for (const file of readFiles(context)) {
      for (const match of file.source.matchAll(hardcodedColorPattern)) {
        const value = match[0];

        if (
          isExcepted({
            ruleId: hardcodedColorRule.definition.id,
            context,
            filePath: file.filePath,
            value,
          })
        ) {
          continue;
        }

        violations.push(
          sourceEvidence(
            file.filePath,
            lineNumberAt(file.source, match.index ?? 0),
            value
          )
        );
      }
    }

    return violations.length === 0
      ? finding(hardcodedColorRule, context, 'pass')
      : finding(
          hardcodedColorRule,
          context,
          'fail',
          'Hardcoded color literals found; use Vellira tokens/theme values or register a narrow explicit exception.',
          violations.slice(0, 8)
        );
  },
};

function hasWebTokenEvidence(source: string) {
  return (
    /\bvar\(--[a-z0-9-]+\)/i.test(source) || /@use\s+['"]@styles\//.test(source)
  );
}

function hasNativeTokenEvidence(source: string) {
  return (
    /\btheme\.tokens\./.test(source) ||
    /\btheme\.components\./.test(source) ||
    /\btheme\.semantic\./.test(source)
  );
}

function hasTokenRelevantDesignProperties(source: string) {
  return /\b(?:color|backgroundColor|borderColor|borderRadius|fontFamily|fontSize|fontWeight|lineHeight|shadowColor|shadowRadius|padding|paddingHorizontal|paddingVertical|margin|gap)\s*:/.test(
    source
  );
}

export const tokenIntegrationRule: ComponentQualityRule = {
  definition: {
    id: 'conformity.token-integration',
    dimension: 'design-system',
    severity: 'required',
    evaluation: 'automated',
    description:
      'Checks platform-appropriate Vellira token/theme integration in styled components.',
  },
  evaluate(context) {
    const files = readFiles(context);
    const styleFiles = files.filter((file) =>
      context.platform === 'react'
        ? /\.(?:css|scss)$/.test(file.filePath)
        : /\.styles\.ts$/.test(file.filePath)
    );

    if (styleFiles.length === 0) {
      return finding(tokenIntegrationRule, context, 'not-applicable');
    }

    const source = styleFiles.map((file) => file.source).join('\n');

    if (
      context.platform === 'react-native' &&
      !hasTokenRelevantDesignProperties(source)
    ) {
      return finding(tokenIntegrationRule, context, 'not-applicable');
    }

    const hasEvidence =
      context.platform === 'react'
        ? hasWebTokenEvidence(source)
        : hasNativeTokenEvidence(source);

    return hasEvidence
      ? finding(
          tokenIntegrationRule,
          context,
          'pass',
          undefined,
          styleFiles
            .slice(0, 6)
            .map((file) => path.relative(process.cwd(), file.filePath))
        )
      : finding(
          tokenIntegrationRule,
          context,
          'fail',
          context.platform === 'react'
            ? 'Styled Web component has no CSS custom-property/@styles token integration evidence.'
            : 'Styled React Native component has no NativeTheme token/component/semantic integration evidence.',
          styleFiles.map((file) => path.relative(process.cwd(), file.filePath))
        );
  },
};

const geometryPattern =
  /(?:padding(?:-inline|-block)?|margin(?:-inline|-block)?|gap|border-radius|borderRadius|paddingHorizontal|paddingVertical)\s*:\s*(\d+(?:\.\d+)?(?:px|rem)?)/g;

export const hardcodedGeometryRule: ComponentQualityRule = {
  definition: {
    id: 'conformity.hardcoded-geometry',
    dimension: 'design-system',
    severity: 'recommended',
    evaluation: 'automated',
    description:
      'Warns about deterministic hardcoded spacing/radius geometry while supporting narrow explicit exceptions.',
  },
  evaluate(context) {
    const violations: string[] = [];

    for (const file of readFiles(context)) {
      const isStyleSurface =
        /\.(?:css|scss)$/.test(file.filePath) ||
        /\.styles\.ts$/.test(file.filePath);

      if (!isStyleSurface) continue;

      for (const match of file.source.matchAll(geometryPattern)) {
        const value = match[1];

        if (!value || value === '0' || value === '0px') continue;

        if (
          isExcepted({
            ruleId: hardcodedGeometryRule.definition.id,
            context,
            filePath: file.filePath,
            value,
          })
        ) {
          continue;
        }

        violations.push(
          sourceEvidence(
            file.filePath,
            lineNumberAt(file.source, match.index ?? 0),
            match[0]
          )
        );
      }
    }

    return violations.length === 0
      ? finding(hardcodedGeometryRule, context, 'pass')
      : finding(
          hardcodedGeometryRule,
          context,
          'warn',
          'Hardcoded spacing/radius geometry found. Prefer Vellira tokens when the value represents a reusable design decision.',
          violations.slice(0, 8)
        );
  },
};

export const conformityQualityRules: readonly ComponentQualityRule[] = [
  tokenIntegrationRule,
  hardcodedColorRule,
  hardcodedGeometryRule,
];
