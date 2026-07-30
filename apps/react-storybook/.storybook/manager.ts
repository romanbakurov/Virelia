import '@vellira-ui/assets/styles';
import '@vellira-ui/tokens/css';

import './manager.css';

import { addons } from 'storybook/manager-api';
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
