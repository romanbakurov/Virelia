import type { ComponentPlatform } from '@vellira-ui/metadata';

const keyPrefix = 'component-quality';
const markerPrefix = 'component-quality-key:';

function normalizePart(value: string) {
  return value.trim().replace(/\s+/g, '-');
}

export function componentQualityFindingKey(
  componentName: string,
  platform: ComponentPlatform,
  ruleId: string
) {
  return [
    keyPrefix,
    normalizePart(componentName),
    normalizePart(platform),
    normalizePart(ruleId),
  ].join(':');
}

export function componentQualityIssueMarker(key: string) {
  return `<!-- ${markerPrefix}${key} -->`;
}

export function extractComponentQualityIssueKey(body: string) {
  const escapedPrefix = markerPrefix.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
  const match = body.match(
    new RegExp(`<!--\\s*${escapedPrefix}([^\\s]+)\\s*-->`)
  );
  return match?.[1];
}
