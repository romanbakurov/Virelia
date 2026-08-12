import styles from './ComponentApi.module.css';

import type { ComponentPlatform } from '../../types';

export type ComponentApiProp = {
  name: string;
  type: string;
  defaultValue?: string;
  description: string;
  required?: boolean;
};

type ComponentApiProps = {
  title?: string;
  description?: string;
  inheritedProps?: readonly ComponentApiProp[];
  platform: ComponentPlatform;
  props: readonly ComponentApiProp[];
};

export function ComponentApi({
  title = 'API',
  description = 'Props available for this component.',
  inheritedProps = [],
  platform,
  props,
}: ComponentApiProps) {
  const inheritedLabel =
    platform === 'react'
      ? 'Inherited React DOM props'
      : 'Inherited React Native props';

  const inheritedDescription =
    platform === 'react'
      ? 'This component also forwards compatible React DOM props.'
      : 'This component also forwards compatible React Native props.';

  return (
    <section className={styles.root}>
      <div className={styles.heading}>
        <div>
          <h2 className={styles.title}>{title}</h2>
          <p className={styles.description}>{description}</p>
        </div>

        <span className={styles.count}>
          {props.length} {props.length === 1 ? 'prop' : 'props'}
        </span>
      </div>

      <ApiTable props={props} />

      {inheritedProps.length > 0 && (
        <details className={styles.inherited}>
          <summary className={styles.inheritedSummary}>
            <span>{inheritedLabel}</span>
            <span className={styles.inheritedCount}>
              {inheritedProps.length}
            </span>
          </summary>

          <p className={styles.inheritedDescription}>{inheritedDescription}</p>

          <ApiTable props={inheritedProps} tone='muted' />
        </details>
      )}
    </section>
  );
}

function ApiTable({
  props,
  tone = 'default',
}: {
  props: readonly ComponentApiProp[];
  tone?: 'default' | 'muted';
}) {
  return (
    <div className={styles.tableWrapper} data-tone={tone}>
      <table className={styles.table}>
        <colgroup>
          <col className={styles.propColumn} />
          <col className={styles.typeColumn} />
          <col className={styles.defaultColumn} />
          <col className={styles.descriptionColumn} />
        </colgroup>

        <thead>
          <tr>
            <th>Prop</th>
            <th>Type</th>
            <th>Default</th>
            <th>Description</th>
          </tr>
        </thead>

        <tbody>
          {props.map((prop) => (
            <tr key={prop.name}>
              <td>
                <div className={styles.propName}>
                  <code>{prop.name}</code>

                  {prop.required && (
                    <span className={styles.required}>Required</span>
                  )}
                </div>
              </td>

              <td>
                <code className={styles.type}>{prop.type}</code>
              </td>

              <td>
                {prop.defaultValue ? (
                  <code className={styles.defaultValue}>
                    {prop.defaultValue}
                  </code>
                ) : (
                  <span className={styles.empty}>—</span>
                )}
              </td>

              <td className={styles.propDescription}>{prop.description}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
