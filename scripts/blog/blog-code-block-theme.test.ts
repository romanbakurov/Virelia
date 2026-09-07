import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';

import { describe, expect, it } from 'vitest';

const codeBlockStyles = readFileSync(
  resolve('apps/website/src/blog/ui/BlogCodeBlock.module.css'),
  'utf8'
);

describe('blog code block theme surfaces', () => {
  it('keeps the toolbar and code body on distinct theme-aware surfaces', () => {
    expect(codeBlockStyles).toContain('background: var(--surface-subtle);');
    expect(codeBlockStyles).toContain('background: var(--surface-muted);');
    expect(codeBlockStyles).toContain('background: var(--surface-default);');
  });

  it('keeps the light code body elevated instead of collapsing into the page canvas', () => {
    expect(codeBlockStyles).toContain(
      ":global([data-vellira-theme='light']) .codeBlock {\n  background: var(--surface-elevated);\n}"
    );
    expect(codeBlockStyles).toContain('var(--surface-elevated) 56%');
    expect(codeBlockStyles).not.toContain(
      ":global([data-vellira-theme='light']) .codeBlock {\n  background: var(--surface-canvas);\n}"
    );
    expect(codeBlockStyles).not.toContain('--surface-background');
  });

  it('keeps the original dark Shiki background while preserving high-contrast surface ownership', () => {
    expect(codeBlockStyles).toContain('color: var(--shiki-dark) !important;');
    expect(codeBlockStyles).toContain(
      'color: var(--shiki-highContrast) !important;'
    );
    expect(
      codeBlockStyles.match(/background-color: transparent !important;/g)
    ).toHaveLength(1);
  });
});
