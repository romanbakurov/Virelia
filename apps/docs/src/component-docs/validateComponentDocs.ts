import type {
  ComponentMetadata,
  ComponentPlatform,
} from '@vellira-ui/metadata';

import type {
  ComponentDocsContract,
  PlatformDocsContract,
  RelatedComponentReference,
  StorybookReference,
} from './types';

export type ComponentDocsValidationResult =
  | {
      valid: true;
      errors: [];
      value: ComponentDocsContract;
    }
  | {
      valid: false;
      errors: string[];
    };

const supportedPlatforms: readonly ComponentPlatform[] = [
  'react',
  'react-native',
];

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null && !Array.isArray(value);
}

function isNonEmptyString(value: unknown): value is string {
  return typeof value === 'string' && value.trim().length > 0;
}

function hasDuplicates(values: readonly string[]) {
  const normalizedValues = values.map((value) => value.trim());

  return new Set(normalizedValues).size !== normalizedValues.length;
}

function validateStringArray(params: {
  value: unknown;
  field: string;
  errors: string[];
}) {
  const { value, field, errors } = params;

  if (!Array.isArray(value)) {
    errors.push(`${field} must be an array of non-empty strings.`);
    return;
  }

  if (!value.every((item) => typeof item === 'string')) {
    errors.push(`${field} must be an array of non-empty strings.`);
    return;
  }

  if (value.some((item) => item.trim().length === 0)) {
    errors.push(`${field} must not contain empty values.`);
  }

  if (hasDuplicates(value)) {
    errors.push(`${field} must not contain duplicates.`);
  }
}

function validateStorybookReference(
  value: unknown,
  field: string,
  errors: string[]
) {
  if (!isRecord(value)) {
    errors.push(`${field} must be an object.`);
    return;
  }

  if (!isNonEmptyString(value.story)) {
    errors.push(`${field}.story must be a non-empty string.`);
  }

  if (!isNonEmptyString(value.title)) {
    errors.push(`${field}.title must be a non-empty string.`);
  }

  if (
    value.height !== undefined &&
    (typeof value.height !== 'number' ||
      !Number.isFinite(value.height) ||
      value.height <= 0)
  ) {
    errors.push(`${field}.height must be a positive finite number.`);
  }
}

function validateRelatedComponents(
  value: unknown,
  field: string,
  errors: string[]
) {
  if (!Array.isArray(value)) {
    errors.push(`${field} must be an array of related component references.`);
    return;
  }

  const components: string[] = [];

  value.forEach((item, index) => {
    const itemField = `${field}[${index}]`;

    if (!isRecord(item)) {
      errors.push(`${itemField} must be an object.`);
      return;
    }

    if (!isNonEmptyString(item.component)) {
      errors.push(`${itemField}.component must be a non-empty string.`);
      return;
    }

    components.push(item.component);

    if (item.label !== undefined && !isNonEmptyString(item.label)) {
      errors.push(`${itemField}.label must be a non-empty string.`);
    }
  });

  if (hasDuplicates(components)) {
    errors.push(`${field} must not contain duplicate components.`);
  }
}

function validatePlatformDocs(
  value: unknown,
  platform: ComponentPlatform,
  errors: string[]
) {
  const field = `platforms.${platform}`;

  if (!isRecord(value)) {
    errors.push(`${field} must be an object.`);
    return;
  }

  for (const requiredField of ['title', 'description', 'summary'] as const) {
    if (!isNonEmptyString(value[requiredField])) {
      errors.push(`${field}.${requiredField} must be a non-empty string.`);
    }
  }

  for (const optionalArrayField of [
    'whenToUse',
    'accessibility',
    'notes',
  ] as const) {
    if (value[optionalArrayField] !== undefined) {
      validateStringArray({
        value: value[optionalArrayField],
        field: `${field}.${optionalArrayField}`,
        errors,
      });
    }
  }

  if (value.storybook !== undefined) {
    validateStorybookReference(value.storybook, `${field}.storybook`, errors);
  }

  if (value.seeAlso !== undefined) {
    validateRelatedComponents(value.seeAlso, `${field}.seeAlso`, errors);
  }
}

export function validateComponentDocs(
  input: unknown,
  metadata: ComponentMetadata
): ComponentDocsValidationResult {
  const errors: string[] = [];

  if (!isRecord(input)) {
    return {
      valid: false,
      errors: ['Component docs contract must be an object.'],
    };
  }

  if (!isNonEmptyString(input.component)) {
    errors.push('component must be a non-empty string.');
  } else if (input.component !== metadata.name) {
    errors.push(
      `component must match metadata.name (${metadata.name}), received ${input.component}.`
    );
  }

  if (!isRecord(input.platforms)) {
    errors.push('platforms must be an object.');
  } else {
    const platformKeys = Object.keys(input.platforms).sort();
    const unsupportedPlatforms = platformKeys.filter(
      (platform) => !supportedPlatforms.includes(platform as ComponentPlatform)
    );

    if (unsupportedPlatforms.length > 0) {
      errors.push(
        `platforms contains unsupported keys: ${unsupportedPlatforms.join(
          ', '
        )}.`
      );
    }

    for (const platform of supportedPlatforms) {
      if (input.platforms[platform] === undefined) {
        continue;
      }

      if (!metadata.platforms.includes(platform)) {
        errors.push(
          `platforms.${platform} is not supported by metadata.platforms for ${metadata.name}.`
        );
      }

      validatePlatformDocs(input.platforms[platform], platform, errors);
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
    value: input as ComponentDocsContract,
  };
}

export type {
  ComponentDocsContract,
  PlatformDocsContract,
  RelatedComponentReference,
  StorybookReference,
};
