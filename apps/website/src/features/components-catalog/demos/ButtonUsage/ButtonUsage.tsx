'use client';

import type { ComponentPlatform } from '../../types';

import { useComponentDemoState } from '../../components/ComponentDemoStateProvider';
import { ComponentCodeBlock } from '../../components/ComponentCodeBlock';

import type { ButtonPlaygroundValue } from '../ButtonPlayground';

import styles from './ButtonUsage.module.css';

const initialValue: ButtonPlaygroundValue = {
  appearance: 'solid',
  color: 'primary',
  size: 'md',
  shape: 'pill',
  state: 'default',
};

type ButtonUsageProps = {
  platform: ComponentPlatform;
};

function createButtonCode(
  platform: ComponentPlatform,
  value: ButtonPlaygroundValue
) {
  const packageName =
    platform === 'react' ? '@vellira-ui/react' : '@vellira-ui/react-native';

  const props: string[] = [];

  if (value.appearance !== 'solid') {
    props.push(`appearance='${value.appearance}'`);
  }

  if (value.color !== 'primary') {
    props.push(`color='${value.color}'`);
  }

  if (value.size !== 'md') {
    props.push(`size='${value.size}'`);
  }

  if (value.shape !== 'pill') {
    props.push(`shape='${value.shape}'`);
  }

  if (value.state === 'disabled') {
    props.push('disabled');
  }

  if (value.state === 'loading') {
    props.push('loading');
    props.push(`loadingText='Loading'`);
  }

  const propsText = props.length === 0 ? '' : `\n  ${props.join('\n  ')}\n`;

  return `import { Button } from '${packageName}';

<Button${propsText}>
  Button
</Button>`;
}

export function ButtonUsage({ platform }: ButtonUsageProps) {
  const [value] = useComponentDemoState<ButtonPlaygroundValue>(initialValue);

  const code = createButtonCode(platform, value);

  return (
    <section className={styles.root}>
      <div className={styles.heading}>
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
