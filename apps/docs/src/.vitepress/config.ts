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

export default defineConfig({
  title: 'Vellira',
  base: '/',
  description: siteDescription,
  cleanUrls: true,
  lastUpdated: true,
  sitemap: {
    hostname: siteUrl,
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
        href: '/brand/icons/apple-touch-icon.png',
      },
    ],
    ['link', { rel: 'canonical', href: siteUrl }],
    ['meta', { property: 'og:type', content: 'website' }],
    ['meta', { property: 'og:site_name', content: 'Vellira Docs' }],
    ['meta', { property: 'og:title', content: 'Vellira Documentation' }],
    ['meta', { property: 'og:description', content: siteDescription }],
    ['meta', { property: 'og:url', content: siteUrl }],
    ['meta', { property: 'og:image', content: socialImage }],
    ['meta', { property: 'og:image:width', content: '1200' }],
    ['meta', { property: 'og:image:height', content: '630' }],
    ['meta', { property: 'og:image:alt', content: 'Vellira design system' }],
    ['meta', { name: 'twitter:card', content: 'summary_large_image' }],
    ['meta', { name: 'twitter:title', content: 'Vellira Documentation' }],
    ['meta', { name: 'twitter:description', content: siteDescription }],
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
