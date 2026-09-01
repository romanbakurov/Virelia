import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';

import { describe, expect, it } from 'vitest';

const heroSource = readFileSync(
  resolve('apps/website/src/sections/home/Hero/Hero.tsx'),
  'utf8'
);

describe('homepage navigation', () => {
  it('routes Explore components to the website component catalog', () => {
    expect(heroSource).toContain("<Link href='/components'>Explore components</Link>");
    expect(heroSource).not.toContain(
      "<Link href='https://docs.vellira.dev/components'>"
    );
  });
});
