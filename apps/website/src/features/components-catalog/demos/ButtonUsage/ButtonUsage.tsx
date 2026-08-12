'use client';

import type { ComponentPlatform } from '../../types';

import { ComponentCodeBlock } from '../../components/ComponentCodeBlock';
import { useComponentDemoState } from '../../components/ComponentDemoStateProvider';

import {
  initialButtonPlaygroundValue,
  type ButtonPlaygroundValue,
} from '../ButtonPlayground';

import styles from '../ButtonUsage/ButtonUsage.module.css';

type ButtonUsageProps = {
  platform: ComponentPlatform;
};

function createButtonCode(
  platform: ComponentPlatform,
  value: ButtonPlaygroundValue
) {
  const packageName =
    platform === 'react' ? '@vellira-ui/react' : '@vellira-ui/react-native';

  const props: string[] = platform === 'react' ? [] : [];

  const children = platform === 'react' ? '  Button' : '  Button';

  if (value.color !== 'primary') {
    props.push(`color='${value.color}'`);
  }

  if (value.appearance !== 'solid') {
    props.push(`appearance='${value.appearance}'`);
  }

  if (value.size !== 'md') {
    props.push(`size='${value.size}'`);
  }

  if (value.shape !== 'pill') {
    props.push(`shape='${value.shape}'`);
  }

  if (value.fullWidth) {
    props.push('fullWidth');
  }

  if (value.loading) {
    props.push('loading');
  }

  if (value.loadingText) {
    props.push(`loadingText='${value.loadingText}'`);
  }

  if (value.disabled) {
    props.push('disabled');
  }

  if (value.iconOnly) {
    props.push('iconOnly');
  }

  const propsText = props.length === 0 ? '' : `\n  ${props.join('\n  ')}\n`;

  if (!children) {
    return `import { Button } from '${packageName}';

<Button${propsText}/>`;
  }

  return `import { Button } from '${packageName}';

<Button${propsText}>
${children}
</Button>`;
}

export function ButtonUsage({ platform }: ButtonUsageProps) {
  const [value] = useComponentDemoState<ButtonPlaygroundValue>(
    initialButtonPlaygroundValue
  );

  const code = createButtonCode(platform, value);

  return (
    <section className={styles.root}>
      <div className={styles.header}>
        <h2 className={styles.title}>Usage</h2>

        <p className={styles.description}>
          Import the component and configure it with the same props used in the
          playground.
        </p>
      </div>

      <ComponentCodeBlock code={code} />
    </section>
  );
}
