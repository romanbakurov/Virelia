import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';

import { describe, expect, it } from 'vitest';

const codeBlockStyles = readFileSync(
  resolve('apps/website/src/blog/ui/BlogCodeBlock.module.css'),
  'utf8'
);

describe('blog code block theme surfaces', () => {
  it('keeps the toolbar and code body on distinct Vellira surfaces', () => {
    expect(codeBlockStyles).toContain('background: var(--surface-subtle);');
    expect(codeBlockStyles).toContain('background: var(--surface-muted);');
  });

  it('keeps Shiki syntax colors while letting Vellira own dark theme surfaces', () => {
    expect(codeBlockStyles).toContain('color: var(--shiki-dark) !important;');
    expect(codeBlockStyles).toContain(
      'color: var(--shiki-highContrast) !important;'
    );
    expect(
      codeBlockStyles.match(/background-color: transparent !important;/g)
    ).toHaveLength(2);
  });
});
