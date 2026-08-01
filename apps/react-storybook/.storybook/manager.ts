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
  },
  {
    id: 'github',
    label: 'GitHub',
    href: 'https://github.com/vellira-dev/vellira',
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
          },
          link.label
        ),
    });
  });
});
