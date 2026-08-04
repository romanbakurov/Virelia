import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';

import { defineConfig } from 'vitepress';

const siteUrl = 'https://docs.vellira.dev';
const siteDescription =
  'TypeScript-first design system documentation for React and React Native applications.';
const socialImage = `${siteUrl}/brand/social/vellira-og-code-to-ui.png`;
const navigationIcon = (name: string) =>
  readFileSync(
    resolve(process.cwd(), '../../packages/assets/brand/navigation', name),
    'utf8'
  )
    .replaceAll('fill="black"', 'fill="currentColor"')
    .replaceAll('fill="#1B1F23"', 'fill="currentColor"')
    .replaceAll('stroke="black"', 'stroke="currentColor"')
    .replaceAll('stroke="#1B1F23"', 'stroke="currentColor"');

const pageUrl = (relativePath: string) => {
  const path = relativePath.replace(/index\.md$/, '').replace(/\.md$/, '');

  return new URL(path, `${siteUrl}/`).toString();
};

export default defineConfig({
  title: 'Vellira Docs',
  titleTemplate: ':title | Vellira Docs',
  base: '/',
  description: siteDescription,
  cleanUrls: true,
  lastUpdated: true,
  sitemap: {
    hostname: siteUrl,
  },
  transformPageData(pageData) {
    const canonicalUrl = pageUrl(pageData.relativePath);
    const isHome = pageData.relativePath === 'index.md';

    const pageTitle =
      pageData.frontmatter.title || pageData.title || 'Vellira Documentation';

    const socialTitle = isHome ? pageTitle : `${pageTitle} | Vellira Docs`;

    const description = pageData.frontmatter.description || siteDescription;

    pageData.frontmatter.head ??= [];

    pageData.frontmatter.head.push(
      ['link', { rel: 'canonical', href: canonicalUrl }],
      ['meta', { property: 'og:title', content: socialTitle }],
      ['meta', { property: 'og:description', content: description }],
      ['meta', { property: 'og:url', content: canonicalUrl }],
      ['meta', { name: 'twitter:title', content: socialTitle }],
      ['meta', { name: 'twitter:description', content: description }]
    );
  },
  head: [
    [
      'link',
      {
        rel: 'icon',
        type: 'image/svg+xml',
        href: '/brand/icons/favicon.svg',
      },
    ],
    ['link', { rel: 'icon', href: '/brand/icons/favicon.ico' }],
    [
      'link',
      {
        rel: 'icon',
        sizes: '32x32',
        href: '/brand/icons/favicon-32x32.png',
      },
    ],
    [
      'link',
      {
        rel: 'icon',
        sizes: '16x16',
        href: '/brand/icons/favicon-16x16.png',
      },
    ],
    [
      'link',
      {
        rel: 'apple-touch-icon',
        href: '/brand/app-icons/vellira-apple-touch-icon.png',
      },
    ],
    ['meta', { property: 'og:type', content: 'website' }],
    ['meta', { property: 'og:site_name', content: 'Vellira Docs' }],
    ['meta', { property: 'og:image', content: socialImage }],
    ['meta', { property: 'og:image:width', content: '1200' }],
    ['meta', { property: 'og:image:height', content: '630' }],
    [
      'meta',
      {
        property: 'og:image:alt',
        content: 'Vellira design system documentation',
      },
    ],
    ['meta', { name: 'twitter:card', content: 'summary_large_image' }],
    ['meta', { name: 'twitter:image', content: socialImage }],
  ],
  themeConfig: {
    siteTitle: false,
    logo: {
      light: '/brand/logos/logo-dark.svg',
      dark: '/brand/logos/logo-light.svg',
      alt: 'Vellira',
    },
    nav: [
      { text: 'Quick Start', link: '/getting-started' },
      { text: 'Components', link: '/components/' },
      { text: 'Web', link: '/web' },
      { text: 'Native', link: '/native' },
      { text: 'Tokens', link: '/tokens' },
      { text: 'Production', link: '/production' },
    ],
    sidebar: [
      {
        text: 'Start',
        items: [
          { text: 'Overview', link: '/' },
          { text: 'Quick Start', link: '/getting-started' },
          { text: 'Component Overview', link: '/component-examples' },
          { text: 'Production', link: '/production' },
          { text: 'Project Sites', link: '/project-sites' },
        ],
      },
      {
        text: 'Components',
        items: [
          { text: 'Overview', link: '/components/' },
          { text: 'Button', link: '/components/button' },
          { text: 'Input', link: '/components/input' },
          { text: 'Checkbox', link: '/components/checkbox' },
          { text: 'RadioGroup', link: '/components/radio-group' },
          { text: 'Select', link: '/components/select' },
          { text: 'FormField', link: '/components/form-field' },
          { text: 'Dropdown', link: '/components/dropdown' },
          { text: 'Tabs', link: '/components/tabs' },
          { text: 'Tooltip', link: '/components/tooltip' },
          { text: 'Modal', link: '/components/modal' },
          { text: 'ThemeProvider', link: '/components/theme-provider' },
        ],
      },
      {
        text: 'Design System',
        items: [
          { text: 'Tokens', link: '/tokens' },
          { text: 'Theme Architecture', link: '/theme-architecture' },
          { text: 'Accessibility', link: '/accessibility' },
        ],
      },
      {
        text: 'Packages',
        items: [
          { text: 'Web', link: '/web' },
          { text: 'Native', link: '/native' },
        ],
      },
      {
        text: 'Project',
        items: [
          { text: 'Quality', link: '/quality' },
          { text: 'Contributing', link: '/contributing' },
        ],
      },
    ],
    socialLinks: [
      {
        icon: { svg: navigationIcon('website.svg') },
        link: 'https://vellira.dev',
      },
      {
        icon: { svg: navigationIcon('github.svg') },
        link: 'https://github.com/vellira-dev/vellira',
      },
      {
        icon: { svg: navigationIcon('storybook.svg') },
        link: 'https://storybook.vellira.dev',
      },
    ],
    search: {
      provider: 'local',
    },
    footer: {
      message: 'Built for Vellira Design System.',
      copyright: 'MIT Licensed.',
    },
  },
});
