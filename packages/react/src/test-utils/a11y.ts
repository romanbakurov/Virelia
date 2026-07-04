import type { ElementContext, Result, RunOptions } from 'axe-core';
import axe from 'axe-core';
import { expect } from 'vitest';

const defaultAxeOptions: RunOptions = {
  rules: {
    'color-contrast': { enabled: false },
    region: { enabled: false },
  },
};

function formatViolation(violation: Result) {
  const nodes = violation.nodes
    .map((node) => `    ${node.target.join(', ')}: ${node.failureSummary}`)
    .join('\n');

  return `${violation.id}: ${violation.help}\n  ${violation.helpUrl}\n${nodes}`;
}

export async function expectNoA11yViolations(
  context: ElementContext = document.body,
  options: RunOptions = {}
) {
  const results = await axe.run(context, {
    ...defaultAxeOptions,
    ...options,
    rules: {
      ...defaultAxeOptions.rules,
      ...options.rules,
    },
  });

  expect(
    results.violations,
    results.violations.map(formatViolation).join('\n\n')
  ).toHaveLength(0);
}
