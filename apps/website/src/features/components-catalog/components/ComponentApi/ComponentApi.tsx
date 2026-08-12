import styles from './ComponentApi.module.css';

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
  props: readonly ComponentApiProp[];
};

export function ComponentApi({
  title = 'API',
  description = 'Props available for this component.',
  props,
}: ComponentApiProps) {
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

      <div className={styles.tableWrapper}>
        <table className={styles.table}>
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
    </section>
  );
}
