'use client';

import type { ComponentPlatform } from '../../types';

import { ComponentCodeBlock } from '../../components/ComponentCodeBlock';
import { useComponentDemoState } from '../../components/ComponentDemoStateProvider';

import {
  initialInputPlaygroundValue,
  type InputPlaygroundValue,
} from '../InputPlayground';

import styles from '../ButtonUsage/ButtonUsage.module.css';

type InputUsageProps = {
  platform: ComponentPlatform;
};

function createInputCode(
  platform: ComponentPlatform,
  value: InputPlaygroundValue
) {
  const packageName =
    platform === 'react' ? '@vellira-ui/react' : '@vellira-ui/react-native';

  const props: string[] = [];

  if (value.type !== 'text') {
    props.push(`type='${value.type}'`);
  }

  if (value.color !== 'primary') {
    props.push(`color='${value.color}'`);
  }

  if (value.variant !== 'outline') {
    props.push(`variant='${value.variant}'`);
  }

  if (value.size !== 'md') {
    props.push(`size='${value.size}'`);
  }

  if (value.state === 'disabled') {
    props.push('disabled');
  }

  if (value.state === 'loading') {
    props.push('loading');
  }

  if (value.state === 'invalid') {
    props.push('invalid');
  }

  if (value.state === 'readOnly') {
    props.push('readOnly');
  }

  if (value.clearable) {
    props.push('clearable');
  }

  if (value.required) {
    props.push('required');
  }

  const propsText = props.length === 0 ? '' : `\n  ${props.join('\n  ')}\n`;

  return `import { Input } from '${packageName}';

<Input${propsText} />`;
}

export function InputUsage({ platform }: InputUsageProps) {
  const [value] = useComponentDemoState<InputPlaygroundValue>(
    initialInputPlaygroundValue
  );

  const code = createInputCode(platform, value);

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
