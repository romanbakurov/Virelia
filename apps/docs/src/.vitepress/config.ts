import { defineConfig } from 'vitepress';

export default defineConfig({
  title: 'Vellira',
  base: '/',
  description:
    'TypeScript-first design system for React and React Native applications.',
  cleanUrls: true,
  lastUpdated: true,
  head: [
    ['link', { rel: 'icon', type: 'image/svg+xml', href: '/favicon.svg' }],
  ],
  themeConfig: {
    logo: '/logo.svg',
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
      { icon: 'github', link: 'https://github.com/vellira-dev/vellira' },
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
