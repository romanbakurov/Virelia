import styles from './ComponentApi.module.css';

import type { ComponentPlatform } from '../../types';

export type ComponentApiProp = {
  name: string;
  type: string;
  defaultValue?: string;
  description: string;
  required?: boolean;
};

export type ComponentApiSection = {
  name: string;
  props: readonly ComponentApiProp[];
};

const genericInheritedDescriptions = new Set([
  'Forwarded React DOM prop.',
  'Forwarded React Native prop.',
]);

const longTypeLength = 40;
const compactTypePreviewLength = 36;

type ComponentApiProps = {
  title?: string;
  description?: string;
  inheritedProps?: readonly ComponentApiProp[];
  platform: ComponentPlatform;
  props?: readonly ComponentApiProp[];
  sections?: readonly ComponentApiSection[];
};

export function ComponentApi({
  title = 'API',
  description = 'Props available for this component.',
  inheritedProps = [],
  platform,
  props = [],
  sections,
}: ComponentApiProps) {
  const apiSections =
    sections && sections.length > 0
      ? sections
      : [
          {
            name: title,
            props,
          },
        ];
  const propCount = apiSections.reduce(
    (count, section) => count + section.props.length,
    0
  );
  const inheritedLabel =
    platform === 'react'
      ? 'Inherited React DOM props'
      : 'Inherited React Native props';

  const inheritedDescription =
    platform === 'react'
      ? 'These props are forwarded to the underlying React DOM element.'
      : 'These props are forwarded to the underlying React Native component.';

  return (
    <section className={styles.root}>
      <div className={styles.heading}>
        <div>
          <h2 className={styles.title}>{title}</h2>
          <p className={styles.description}>{description}</p>
        </div>

        <span className={styles.count}>
          {propCount} {propCount === 1 ? 'prop' : 'props'}
        </span>
      </div>

      <div className={styles.sections}>
        {apiSections.map((section) => (
          <section key={section.name} className={styles.apiSection}>
            {apiSections.length > 1 && (
              <h3 className={styles.sectionTitle}>{section.name}</h3>
            )}

            <MainApiTable props={section.props} />
          </section>
        ))}
      </div>

      {inheritedProps.length > 0 && (
        <details className={styles.inherited}>
          <summary className={styles.inheritedSummary}>
            <span>{inheritedLabel}</span>
            <span className={styles.inheritedCount}>
              {inheritedProps.length}
            </span>
          </summary>

          <p className={styles.inheritedDescription}>{inheritedDescription}</p>

          <InheritedApiTable props={inheritedProps} />
        </details>
      )}
    </section>
  );
}

function MainApiTable({ props }: { props: readonly ComponentApiProp[] }) {
  return (
    <div className={styles.tableWrapper}>
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
              <td data-label='Prop'>
                <PropName prop={prop} />
              </td>

              <td data-label='Type'>
                <TypeValue type={prop.type} />
              </td>

              <td data-label='Default'>
                {prop.defaultValue ? (
                  <code className={styles.defaultValue}>
                    {prop.defaultValue}
                  </code>
                ) : (
                  <span className={styles.empty}>-</span>
                )}
              </td>

              <td className={styles.propDescription} data-label='Description'>
                {prop.description}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

function InheritedApiTable({ props }: { props: readonly ComponentApiProp[] }) {
  return (
    <div className={styles.tableWrapper} data-tone='muted'>
      <table className={`${styles.table} ${styles.inheritedTable}`}>
        <colgroup>
          <col className={styles.inheritedPropColumn} />
          <col className={styles.inheritedTypeColumn} />
          <col className={styles.inheritedDescriptionColumn} />
        </colgroup>

        <thead>
          <tr>
            <th>Prop</th>
            <th>Type</th>
            <th>Description</th>
          </tr>
        </thead>

        <tbody>
          {props.map((prop) => (
            <tr key={prop.name}>
              <td data-label='Prop'>
                <PropName prop={prop} />
              </td>

              <td data-label='Type'>
                <TypeValue compact type={prop.type} />
              </td>

              <td
                className={styles.inheritedPropDescription}
                data-empty={
                  hasUsefulInheritedDescription(prop.description)
                    ? 'false'
                    : 'true'
                }
                data-label='Description'
              >
                <InheritedDescription description={prop.description} />
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

function PropName({ prop }: { prop: ComponentApiProp }) {
  return (
    <div className={styles.propName}>
      <code>{prop.name}</code>

      {prop.required && <span className={styles.required}>Required</span>}
    </div>
  );
}

function TypeValue({
  compact = false,
  type,
}: {
  compact?: boolean;
  type: string;
}) {
  if (compact && isLongType(type)) {
    return (
      <details className={styles.typeDetails}>
        <summary>
          <code className={`${styles.type} ${styles.typePreview}`}>
            {shortenType(type)}
          </code>
          <span>Full type</span>
        </summary>

        <code className={styles.type}>{renderWrappableType(type)}</code>
      </details>
    );
  }

  return <code className={styles.type}>{renderWrappableType(type)}</code>;
}

function InheritedDescription({ description }: { description: string }) {
  if (!hasUsefulInheritedDescription(description)) {
    return <span className={styles.empty}>-</span>;
  }

  return (
    <details className={styles.descriptionDetails}>
      <summary>Show description</summary>
      <p>{description}</p>
    </details>
  );
}

function renderWrappableType(type: string) {
  return type.split(/([<>,|()[\]\s])/g).map((part, index) => {
    if (!part) return null;

    if (/^[<>,|()[\]\s]$/.test(part)) {
      return (
        <span key={`${part}-${index}`}>
          {part}
          <wbr />
        </span>
      );
    }

    return <span key={`${part}-${index}`}>{part}</span>;
  });
}

function isLongType(type: string) {
  return (
    type.length > longTypeLength ||
    type.includes('=>') ||
    type.split('|').length > 3
  );
}

function shortenType(type: string) {
  if (type.length <= compactTypePreviewLength) {
    return type;
  }

  return `${type.slice(0, compactTypePreviewLength - 1).trim()}...`;
}

function hasUsefulInheritedDescription(description: string) {
  return Boolean(description) && !genericInheritedDescriptions.has(description);
}
