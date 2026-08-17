import { describe, expect, it } from 'vitest';

import { formatComponentCompletenessResult } from './run';

describe('component completeness output', () => {
  it('formats a ready component', () => {
    const output = formatComponentCompletenessResult({
      componentName: 'Button',
      ready: true,
      checks: [
        {
          name: 'implementation',
          ok: true,
        },
        {
          name: 'types',
          ok: true,
        },
      ],
    });

    expect(output).toContain('Button');
    expect(output).toContain('implementation');
    expect(output).toContain('✓');
    expect(output).toContain('READY');
  });

  it('formats an incomplete component with details', () => {
    const output = formatComponentCompletenessResult({
      componentName: 'Select',
      ready: false,
      checks: [
        {
          name: 'website',
          ok: false,
          details: 'Missing "select" in website component catalog.',
        },
      ],
    });

    expect(output).toContain('Select');
    expect(output).toContain('✗');
    expect(output).toContain('Missing "select" in website component catalog.');
    expect(output).toContain('INCOMPLETE');
  });
});
