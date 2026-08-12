'use client';

import type { ComponentPlatform } from '../../types';

import { ComponentCodeBlock } from '../../components/ComponentCodeBlock';
import { useComponentDemoState } from '../../components/ComponentDemoStateProvider';

import {
  initialCheckboxPlaygroundValue,
  type CheckboxPlaygroundValue,
} from '../CheckboxPlayground';

import styles from '../ButtonUsage/ButtonUsage.module.css';

type CheckboxUsageProps = {
  platform: ComponentPlatform;
};

function createCheckboxCode(
  platform: ComponentPlatform,
  value: CheckboxPlaygroundValue
) {
  const packageName =
    platform === 'react' ? '@vellira-ui/react' : '@vellira-ui/react-native';

  const props: string[] = [`label='Accept terms'`];

  if (value.color !== 'primary') {
    props.push(`color='${value.color}'`);
  }

  if (value.size !== 'md') {
    props.push(`size='${value.size}'`);
  }

  if (value.labelPosition !== 'end') {
    props.push(`labelPosition='${value.labelPosition}'`);
  }

  if (value.state === 'disabled') {
    props.push('disabled');
  }

  if (value.state === 'indeterminate') {
    props.push('indeterminate');
  }

  if (value.state === 'error') {
    props.push(`error='Please confirm this option.'`);
  }

  if (value.required) {
    props.push('required');
  }

  const propsText = `\n  ${props.join('\n  ')}\n`;

  return `import { Checkbox } from '${packageName}';

<Checkbox${propsText}/>`;
}

export function CheckboxUsage({ platform }: CheckboxUsageProps) {
  const [value] = useComponentDemoState<CheckboxPlaygroundValue>(
    initialCheckboxPlaygroundValue
  );

  const code = createCheckboxCode(platform, value);

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
