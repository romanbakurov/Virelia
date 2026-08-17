import {
  type ComponentCapability,
  type ComponentCategory,
  type ComponentLayer,
  type ComponentMetadata,
  type ComponentPlatform,
  type ComponentStatus,
} from './component';

export type ComponentMetadataValidationResult =
  | {
      valid: true;
      errors: [];
      value: ComponentMetadata;
    }
  | {
      valid: false;
      errors: string[];
    };

const componentLayers: readonly ComponentLayer[] = [
  'primitives',
  'components',
  'patterns',
];

const componentCategories: readonly ComponentCategory[] = [
  'action',
  'form',
  'navigation',
  'overlay',
  'feedback',
  'data-display',
  'layout',
  'utility',
];

const componentPlatforms: readonly ComponentPlatform[] = [
  'react',
  'react-native',
];

const componentStatuses: readonly ComponentStatus[] = [
  'experimental',
  'stable',
  'deprecated',
];

const componentCapabilities: readonly ComponentCapability[] = [
  'controlled',
  'uncontrolled',
  'disabled',
  'required',
  'invalid',
  'loading',
  'keyboard',
  'focus-management',
  'compound-api',
  'portal',
  'responsive',
];

const COMPONENT_PROFILES = [
  'base',
  'form-control',
  'compound',
  'overlay',
] as const;

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null && !Array.isArray(value);
}

function isNonEmptyString(value: unknown): value is string {
  return typeof value === 'string' && value.trim().length > 0;
}

function hasDuplicates(values: readonly string[]) {
  return new Set(values).size !== values.length;
}

function isStringArray(value: unknown): value is string[] {
  return (
    Array.isArray(value) && value.every((item) => typeof item === 'string')
  );
}

function validateStringArray(params: {
  value: unknown;
  field: string;
  errors: string[];
  allowedValues?: readonly string[];
  requireNonEmpty?: boolean;
}) {
  const {
    value,
    field,
    errors,
    allowedValues,
    requireNonEmpty = false,
  } = params;

  if (!isStringArray(value)) {
    errors.push(`${field} must be an array of strings.`);
    return;
  }

  if (requireNonEmpty && value.length === 0) {
    errors.push(`${field} must contain at least one value.`);
  }

  if (value.some((item) => item.trim().length === 0)) {
    errors.push(`${field} must not contain empty values.`);
  }

  if (hasDuplicates(value)) {
    errors.push(`${field} must not contain duplicates.`);
  }

  if (allowedValues) {
    const invalidValues = value.filter((item) => !allowedValues.includes(item));

    if (invalidValues.length > 0) {
      errors.push(
        `${field} contains unsupported values: ${invalidValues.join(', ')}.`
      );
    }
  }
}

export function validateComponentMetadata(
  input: unknown
): ComponentMetadataValidationResult {
  const errors: string[] = [];

  if (!isRecord(input)) {
    return {
      valid: false,
      errors: ['Component metadata must be an object.'],
    };
  }

  if (!isNonEmptyString(input.name)) {
    errors.push('name must be a non-empty string.');
  }

  if (
    typeof input.layer !== 'string' ||
    !componentLayers.includes(input.layer as ComponentLayer)
  ) {
    errors.push(`layer must be one of: ${componentLayers.join(', ')}.`);
  }

  if (
    typeof input.category !== 'string' ||
    !componentCategories.includes(input.category as ComponentCategory)
  ) {
    errors.push(`category must be one of: ${componentCategories.join(', ')}.`);
  }

  if (
    typeof input.profile !== 'string' ||
    !COMPONENT_PROFILES.includes(
      input.profile as (typeof COMPONENT_PROFILES)[number]
    )
  ) {
    errors.push(`profile must be one of: ${COMPONENT_PROFILES.join(', ')}.`);
  }

  validateStringArray({
    value: input.platforms,
    field: 'platforms',
    errors,
    allowedValues: componentPlatforms,
    requireNonEmpty: true,
  });

  if (
    typeof input.status !== 'string' ||
    !componentStatuses.includes(input.status as ComponentStatus)
  ) {
    errors.push(`status must be one of: ${componentStatuses.join(', ')}.`);
  }

  if (input.capabilities !== undefined) {
    validateStringArray({
      value: input.capabilities,
      field: 'capabilities',
      errors,
      allowedValues: componentCapabilities,
    });
  }

  if (input.dependencies !== undefined) {
    if (!isRecord(input.dependencies)) {
      errors.push('dependencies must be an object.');
    } else {
      if (input.dependencies.packages !== undefined) {
        validateStringArray({
          value: input.dependencies.packages,
          field: 'dependencies.packages',
          errors,
        });
      }

      if (input.dependencies.components !== undefined) {
        validateStringArray({
          value: input.dependencies.components,
          field: 'dependencies.components',
          errors,
        });
      }
    }
  }

  if (!isRecord(input.requirements)) {
    errors.push('requirements must be an object.');
  } else {
    for (const field of [
      'tests',
      'storybook',
      'docs',
      'accessibility',
    ] as const) {
      if (typeof input.requirements[field] !== 'boolean') {
        errors.push(`requirements.${field} must be a boolean.`);
      }
    }

    if (input.requirements.tokens !== undefined) {
      validateStringArray({
        value: input.requirements.tokens,
        field: 'requirements.tokens',
        errors,
      });
    }
  }

  if (errors.length > 0) {
    return {
      valid: false,
      errors,
    };
  }

  return {
    valid: true,
    errors: [],
    value: input as unknown as ComponentMetadata,
  };
}
