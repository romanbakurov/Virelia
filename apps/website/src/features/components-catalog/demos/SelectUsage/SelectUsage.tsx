'use client';

import type { ComponentPlatform } from '../../types';

import { ComponentCodeBlock } from '../../components/ComponentCodeBlock';
import { useComponentDemoState } from '../../components/ComponentDemoStateProvider';

import {
  initialSelectPlaygroundValue,
  type SelectPlaygroundValue,
} from '../SelectPlayground';

import styles from '../ButtonUsage/ButtonUsage.module.css';

type SelectUsageProps = {
  platform: ComponentPlatform;
};

function createSelectCode(
  platform: ComponentPlatform,
  value: SelectPlaygroundValue
) {
  const packageName =
    platform === 'react' ? '@vellira-ui/react' : '@vellira-ui/react-native';

  const props: string[] = [
    "label='Favorite framework'",
    "description='Choose one option.'",
  ];

  if (value.placeholder) {
    props.push(`placeholder='${value.placeholder}'`);
  }

  if (value.size !== 'md') {
    props.push(`size='${value.size}'`);
  }

  if (value.color !== 'primary') {
    props.push(`color='${value.color}'`);
  }

  if (value.variant !== 'outline') {
    props.push(`variant='${value.variant}'`);
  }

  if (value.invalid) {
    props.push('invalid');
  }

  if (value.loading) {
    props.push('loading');
  }

  if (value.clearable) {
    props.push('clearable');
  }

  if (value.searchable) {
    props.push('searchable');
  }

  if (value.error) {
    props.push(`error='${value.error}'`);
  }

  if (value.disabled) {
    props.push('disabled');
  }

  const propsText = props.length === 0 ? '' : `\n  ${props.join('\n  ')}\n`;

  return `import { Select } from '${packageName}';

<Select${propsText}/>`;
}

export function SelectUsage({ platform }: SelectUsageProps) {
  const [value] = useComponentDemoState<SelectPlaygroundValue>(
    initialSelectPlaygroundValue
  );

  const code = createSelectCode(platform, value);

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
