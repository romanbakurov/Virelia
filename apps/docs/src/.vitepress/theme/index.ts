import DefaultTheme from 'vitepress/theme';
import StorybookFrame from './StorybookFrame.vue';
import '@vellira-ui/assets/styles';
import './layout-stability.css';
import './styles.css';

export default {
  extends: DefaultTheme,
  enhanceApp({ app }) {
    app.component('StorybookFrame', StorybookFrame);
  },
};
