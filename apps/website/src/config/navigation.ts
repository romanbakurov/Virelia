import { componentsPortalEnabled } from './features';

export type MarketingNavigationItem =
  | {
      label: string;
      href: '/components';
      type: 'page';
      badge?: string;
    }
  | {
      label: string;
      href: `/#${string}`;
      hash: `#${string}`;
      type: 'section';
      badge?: string;
    };

const componentNavigation: readonly MarketingNavigationItem[] =
  componentsPortalEnabled
    ? [
        {
          label: 'Components',
          href: '/components',
          type: 'page',
        },
      ]
    : [];

const sectionNavigation = [
  {
    label: 'Themes',
    href: '/#themes',
    hash: '#themes',
    type: 'section',
  },
  {
    label: 'Platforms',
    href: '/#platforms',
    hash: '#platforms',
    type: 'section',
  },
  {
    label: 'Roadmap',
    href: '/#roadmap',
    hash: '#roadmap',
    type: 'section',
  },
  {
    label: 'Pro',
    href: '/#pro',
    hash: '#pro',
    type: 'section',
    badge: 'NEW',
  },
] as const satisfies readonly MarketingNavigationItem[];

export const marketingNavigation: readonly MarketingNavigationItem[] = [
  ...componentNavigation,
  ...sectionNavigation,
];

export const externalNavigation = [
  {
    label: 'Documentation',
    href: 'https://docs.vellira.dev',
    icon: '/brand/navigation/documentation.svg',
    iconSize: 20,
  },
  {
    label: 'Storybook',
    href: 'https://storybook.vellira.dev',
    icon: '/brand/navigation/storybook.svg',
    iconSize: 20,
  },
  {
    label: 'GitHub',
    href: 'https://github.com/vellira-dev/vellira',
    icon: '/brand/navigation/github.svg',
    iconSize: 19,
  },
] as const;
