import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';

import { describe, expect, it } from 'vitest';

const siteHeaderSource = readFileSync(
  resolve('apps/website/src/components/layout/SiteHeader/SiteHeader.tsx'),
  'utf8'
);
const siteFooterSource = readFileSync(
  resolve('apps/website/src/components/layout/SiteFooter/SiteFooter.tsx'),
  'utf8'
);

describe('site navigation prefetch policy', () => {
  it('disables prefetch only for home brand and section-anchor links', () => {
    const headerSectionPrefetch =
      "prefetch={item.type === 'section' ? false : undefined}";
    const footerSectionPrefetch =
      "prefetch={link.href.startsWith('/#') ? false : undefined}";

    expect(siteHeaderSource).toContain(
      "<Link href='/' prefetch={false} className={styles.brand}>"
    );
    expect(siteHeaderSource.split(headerSectionPrefetch)).toHaveLength(3);
    expect(siteHeaderSource).toContain('href={item.href}');

    expect(siteFooterSource).toContain('prefetch={false}');
    expect(siteFooterSource).toContain(footerSectionPrefetch);
    expect(
      `${siteHeaderSource}\n${siteFooterSource}`.split('prefetch={false}')
    ).toHaveLength(3);
    expect(siteFooterSource).toContain('{productLinks.map((link) => (');
  });
});
