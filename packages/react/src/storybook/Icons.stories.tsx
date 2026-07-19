import type { Meta, StoryObj } from '@storybook/react-vite';
import * as staticIcons from '@vellira-ui/icons';
import {
  type AnimatedIconData,
  animatedIconManifest,
  type AnimatedIconName,
  animatedIcons,
} from '@vellira-ui/icons/lottie';
import type { ComponentType, CSSProperties, SVGProps } from 'react';

import { AnimatedIconPreview } from './AnimatedIconPreview';

type StaticIconComponent = ComponentType<
  SVGProps<SVGSVGElement> & {
    size?: number | string;
    color?: string;
  }
>;

const meta = {
  title: 'Icons/Overview',
  parameters: {
    layout: 'fullscreen',
    docs: {
      description: {
        component:
          'Static SVG icons and animated lottie icons from @vellira-ui/icons.',
      },
    },
  },
} satisfies Meta;

export default meta;
type Story = StoryObj<typeof meta>;

const pageStyle = {
  minHeight: '100vh',
  padding: 32,
  color: 'var(--text-primary)',
  background: 'var(--background-primary)',
} satisfies CSSProperties;

const sectionStyle = {
  display: 'grid',
  gap: 16,
  marginBottom: 40,
} satisfies CSSProperties;

const headingStyle = {
  margin: 0,
  fontSize: 20,
  fontWeight: 700,
} satisfies CSSProperties;

const gridStyle = {
  display: 'grid',
  gridTemplateColumns: 'repeat(auto-fill, minmax(116px, 1fr))',
  gap: 8,
} satisfies CSSProperties;

const cardStyle = {
  display: 'grid',
  gridTemplateRows: '44px auto',
  alignItems: 'center',
  justifyItems: 'center',
  minWidth: 0,
  minHeight: 84,
  padding: 12,
  border: '1px solid var(--border-muted)',
  borderRadius: 8,
  color: 'var(--text-brand)',
  background: 'color-mix(in srgb, var(--background-primary) 94%, currentColor)',
} satisfies CSSProperties;

const labelStyle = {
  maxWidth: '100%',
  overflow: 'hidden',
  color: 'var(--text-secondary)',
  fontSize: 12,
  lineHeight: '16px',
  textOverflow: 'ellipsis',
  whiteSpace: 'nowrap',
} satisfies CSSProperties;

const categoryStyle = {
  display: 'grid',
  gap: 10,
} satisfies CSSProperties;

const categoryHeadingStyle = {
  margin: 0,
  color: 'var(--text-secondary)',
  fontSize: 13,
  fontWeight: 700,
} satisfies CSSProperties;

const staticIconEntries = Object.entries(staticIcons).sort(
  ([first], [second]) => first.localeCompare(second)
) as Array<[string, StaticIconComponent]>;

const animatedIconsByCategory = animatedIconManifest.icons.reduce<
  Record<string, Array<[AnimatedIconName, AnimatedIconData]>>
>((groups, icon) => {
  const name = icon.name as AnimatedIconName;
  const data = animatedIcons[name];

  if (!data) return groups;

  groups[icon.category] ??= [];
  groups[icon.category].push([name, data]);

  return groups;
}, {});

export const Static: Story = {
  render: () => (
    <main style={pageStyle}>
      <section style={sectionStyle}>
        <h2 style={headingStyle}>Static icons</h2>
        <div style={gridStyle}>
          {staticIconEntries.map(([name, Icon]) => (
            <div key={name} style={cardStyle} title={name}>
              <Icon aria-hidden='true' size={24} />
              <span style={labelStyle}>{name}</span>
            </div>
          ))}
        </div>
      </section>
    </main>
  ),
};

export const Animated: Story = {
  render: () => (
    <main style={pageStyle}>
      <section style={sectionStyle}>
        <h2 style={headingStyle}>Animated icons</h2>
        {Object.entries(animatedIconsByCategory).map(([category, icons]) => (
          <div key={category} style={categoryStyle}>
            <h3 style={categoryHeadingStyle}>{category}</h3>
            <div style={gridStyle}>
              {icons.map(([name, data]) => (
                <div
                  key={name}
                  data-animated-icon-trigger=''
                  style={cardStyle}
                  title={name}
                >
                  <AnimatedIconPreview data={data} size={24} />
                  <span style={labelStyle}>{name}</span>
                </div>
              ))}
            </div>
          </div>
        ))}
      </section>
    </main>
  ),
};

export const All: Story = {
  render: () => (
    <main style={pageStyle}>
      <section style={sectionStyle}>
        <h2 style={headingStyle}>Static icons</h2>
        <div style={gridStyle}>
          {staticIconEntries.map(([name, Icon]) => (
            <div key={name} style={cardStyle} title={name}>
              <Icon aria-hidden='true' size={24} />
              <span style={labelStyle}>{name}</span>
            </div>
          ))}
        </div>
      </section>
      <section style={sectionStyle}>
        <h2 style={headingStyle}>Animated icons</h2>
        {Object.entries(animatedIconsByCategory).map(([category, icons]) => (
          <div key={category} style={categoryStyle}>
            <h3 style={categoryHeadingStyle}>{category}</h3>
            <div style={gridStyle}>
              {icons.map(([name, data]) => (
                <div
                  key={name}
                  data-animated-icon-trigger=''
                  style={cardStyle}
                  title={name}
                >
                  <AnimatedIconPreview data={data} size={24} />
                  <span style={labelStyle}>{name}</span>
                </div>
              ))}
            </div>
          </div>
        ))}
      </section>
    </main>
  ),
};
