import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';

import { describe, expect, it } from 'vitest';

const articlePageSource = readFileSync(
  resolve('apps/website/src/app/(marketing)/(site)/blog/[slug]/page.tsx'),
  'utf8'
);
const blogIndexSource = readFileSync(
  resolve('apps/website/src/app/(marketing)/(site)/blog/page.tsx'),
  'utf8'
);
const backToTopSource = readFileSync(
  resolve(
    'apps/website/src/components/navigation/BackToTop/BackToTop.tsx'
  ),
  'utf8'
);
const backToTopStyles = readFileSync(
  resolve(
    'apps/website/src/components/navigation/BackToTop/BackToTop.module.css'
  ),
  'utf8'
);

describe('blog back to top integration', () => {
  it('reuses the shared site control only on article pages', () => {
    expect(articlePageSource).toContain(
      "import { BackToTop } from '@/components/navigation/BackToTop';"
    );
    expect(articlePageSource).toContain('<BackToTop />');
    expect(blogIndexSource).not.toContain('<BackToTop />');
  });

  it('preserves the shared accessible scroll behavior', () => {
    expect(backToTopSource).toContain("'use client';");
    expect(backToTopSource).toContain('setIsVisible(window.scrollY > 640);');
    expect(backToTopSource).toContain("aria-label='Back to top'");
    expect(backToTopSource).toContain('window.scrollTo({');
    expect(backToTopSource).toContain(
      "behavior: shouldReduceMotion ? 'auto' : 'smooth'"
    );
    expect(backToTopSource).toContain(
      "window.addEventListener('scroll', updateVisibility, { passive: true });"
    );
    expect(backToTopSource).toContain(
      "window.removeEventListener('scroll', updateVisibility);"
    );
  });

  it('keeps the shared control fixed, responsive, and keyboard visible', () => {
    expect(backToTopStyles).toContain('position: fixed;');
    expect(backToTopStyles).toContain('.button:focus-visible');
    expect(backToTopStyles).toContain('@media (width <= 640px)');
    expect(backToTopStyles).toContain(
      '@media (prefers-reduced-motion: reduce)'
    );
  });
});
