import '@vellira-ui/assets/styles';
import '@vellira-ui/tokens/css';

import './manager.css';

import React from 'react';

import { addons } from 'storybook/manager-api';
import { types } from 'storybook/manager-api';
import { create } from 'storybook/theming';

const theme = create({
  base: 'light',
  brandTitle: 'Vellira Storybook',
  brandImage: '/logo.svg',
  brandUrl: 'https://vellira.dev',
});

addons.setConfig({
  theme,
});

const toolbarLinks = [
  {
    id: 'documentation',
    label: 'Documentation',
    href: 'https://docs.vellira.dev',
    icon: '/brand/navigation/documentation.svg',
    iconSize: '17px',
  },
  {
    id: 'github',
    label: 'GitHub',
    href: 'https://github.com/vellira-dev/vellira',
    icon: '/brand/navigation/github.svg',
    iconSize: '16px',
  },
] as const;

addons.register('vellira/navigation-links', () => {
  toolbarLinks.forEach((link) => {
    addons.add(`vellira/navigation-links/${link.id}`, {
      title: link.label,
      type: types.TOOLEXTRA,
      render: () =>
        React.createElement(
          'a',
          {
            className: 'velliraToolbarLink',
            href: link.href,
            rel: 'noreferrer noopener',
            target: '_blank',
            title: link.label,
          },
          React.createElement('span', {
            'aria-hidden': 'true',
            className: 'velliraToolbarIcon',
            style: {
              '--vellira-toolbar-icon': `url(${link.icon})`,
              '--vellira-toolbar-icon-size': link.iconSize,
            } as React.CSSProperties & {
              '--vellira-toolbar-icon': string;
              '--vellira-toolbar-icon-size': string;
            },
          }),
          React.createElement(
            'span',
            { className: 'velliraToolbarLabel' },
            link.label
          )
        ),
    });
  });
});
