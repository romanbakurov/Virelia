import { useState } from 'react';

import type { Meta, StoryObj } from '@storybook/react-vite';
import {
  Bell,
  Folder,
  Headphones,
  Home,
  Image,
  Settings,
  User,
} from '@vellira-ui/icons';
import type { CSSProperties, ReactNode } from 'react';

import { Tabs } from '../Tabs';

const noop = () => undefined;

const stackStyle = {
  display: 'grid',
  gap: 24,
  minWidth: 0,
} satisfies CSSProperties;

const sectionStyle = {
  display: 'flex',
  flexDirection: 'column',
  gap: 16,
  minWidth: 0,
  maxWidth: 760,
  padding: 20,
  border: '1px solid var(--border-muted)',
  borderRadius: 'var(--radius-xl)',
  background: 'var(--surface-subtle)',
} satisfies CSSProperties;

const subtitleStyle = {
  margin: 0,
  color: 'var(--text-secondary)',
  fontSize: 13,
  fontWeight: 600,
} satisfies CSSProperties;

const currentValueStyle = {
  margin: 0,
  color: 'var(--text-secondary)',
  fontSize: 14,
} satisfies CSSProperties;

function Section({ title, children }: { title: string; children: ReactNode }) {
  return (
    <section style={sectionStyle}>
      <h3 style={subtitleStyle}>{title}</h3>
      {children}
    </section>
  );
}

const meta = {
  title: 'Components/Tabs',
  component: Tabs,
  tags: ['autodocs'],

  parameters: {
    docs: {
      description: {
        component: `
### Tabs Component

Compound navigation component for switching between related sections of content.

**Features**
- Value-based compound API with List, Trigger, Content, Indicator, Icon, and
  Badge parts
- Controlled and uncontrolled value state
- Horizontal and vertical orientation
- Automatic and manual activation modes
- Line, pills, and segmented variants
- Primary, neutral, success, warning, and danger colors
- Sizes: sm, md, and lg
- Disabled triggers, rich trigger content, icons, badges, and descriptions
- Root-level or list-level scrollable tabs
- keepMounted, lazyMount, and forceMount mounting policies
- Arrow, Home, End, PageUp, PageDown, loop, and RTL keyboard navigation

### Usage

Use Tabs when related panels share the same page or screen context and only one
panel should be active at a time.

\`\`\`tsx
<Tabs defaultValue='overview' variant='line' color='primary'>
  <Tabs.List aria-label='Account sections'>
    <Tabs.Trigger value='overview'>
      Overview
    </Tabs.Trigger>

    <Tabs.Trigger value='settings'>
      Settings
    </Tabs.Trigger>

    <Tabs.Indicator />
  </Tabs.List>

  <Tabs.Content value='overview'>
    Overview content
  </Tabs.Content>

  <Tabs.Content value='settings'>
    Settings content
  </Tabs.Content>
</Tabs>
\`\`\`

### Accessibility

Tabs use the WAI-ARIA tabs pattern:

- \`Tabs.List\` renders a tab list
- \`Tabs.Trigger\` renders a tab
- \`Tabs.Content\` renders a tab panel
- triggers and content are connected through accessible IDs
- disabled triggers are skipped during keyboard navigation
- automatic and manual keyboard activation are supported
`,
      },
    },
  },

  args: {
    defaultValue: 'home',
    orientation: 'horizontal',
    activationMode: 'automatic',
    loop: true,
    variant: 'line',
    color: 'primary',
    size: 'md',
    onValueChange: noop,
  },

  argTypes: {
    children: {
      description:
        'Compound content composed from Tabs.List, Tabs.Trigger, and Tabs.Content.',
      control: false,
      table: {
        type: { summary: 'ReactNode' },
      },
    },

    value: {
      description: 'Controlled value of the active trigger.',
      control: 'text',
      table: {
        type: { summary: 'string' },
      },
    },

    defaultValue: {
      description: 'Initially active value in uncontrolled mode.',
      control: 'text',
      table: {
        type: { summary: 'string' },
        defaultValue: { summary: 'home' },
      },
    },

    onValueChange: {
      description: 'Called when the active value changes.',
      action: 'value changed',
      table: {
        type: { summary: '(value: string) => void' },
      },
    },

    orientation: {
      description: 'Layout and keyboard-navigation orientation.',
      control: 'select',
      options: ['horizontal', 'vertical'],
      table: {
        type: { summary: `'horizontal' | 'vertical'` },
        defaultValue: { summary: 'horizontal' },
      },
    },

    activationMode: {
      description:
        'Whether keyboard focus activates a trigger automatically or requires Enter or Space.',
      control: 'select',
      options: ['automatic', 'manual'],
      table: {
        type: { summary: `'automatic' | 'manual'` },
        defaultValue: { summary: 'automatic' },
      },
    },

    loop: {
      description:
        'Whether keyboard navigation wraps between the first and last enabled triggers.',
      control: 'boolean',
      table: {
        type: { summary: 'boolean' },
        defaultValue: { summary: 'true' },
      },
    },

    variant: {
      description: 'Visual treatment of the tab list and triggers.',
      control: 'select',
      options: ['line', 'pills', 'segmented'],
      table: {
        type: { summary: `'line' | 'pills' | 'segmented'` },
        defaultValue: { summary: 'line' },
      },
    },

    color: {
      description: 'Semantic color of the active state.',
      control: 'select',
      options: ['primary', 'neutral', 'success', 'warning', 'danger'],
      table: {
        type: {
          summary: `'primary' | 'neutral' | 'success' | 'warning' | 'danger'`,
        },
        defaultValue: { summary: 'primary' },
      },
    },

    size: {
      description: 'Size of the tab triggers.',
      control: 'select',
      options: ['sm', 'md', 'lg'],
      table: {
        type: { summary: `'sm' | 'md' | 'lg'` },
        defaultValue: { summary: 'md' },
      },
    },
  },
} satisfies Meta<typeof Tabs>;

export default meta;

type Story = StoryObj<typeof meta>;

interface DemoTriggersProps {
  disabledSettings?: boolean;
  iconOnly?: boolean;
}

const DemoTriggers = ({
  disabledSettings = false,
  iconOnly = false,
}: DemoTriggersProps) => (
  <>
    <Tabs.Trigger
      value='home'
      icon={<Home />}
      aria-label={iconOnly ? 'Home' : undefined}
    >
      {iconOnly ? null : 'Home'}
    </Tabs.Trigger>

    <Tabs.Trigger
      value='profile'
      icon={<User />}
      aria-label={iconOnly ? 'Profile' : undefined}
    >
      {iconOnly ? null : 'Profile'}
    </Tabs.Trigger>

    <Tabs.Trigger
      value='settings'
      icon={<Settings />}
      disabled={disabledSettings}
      aria-label={iconOnly ? 'Settings' : undefined}
    >
      {iconOnly ? null : 'Settings'}
    </Tabs.Trigger>

    <Tabs.Trigger
      value='notifications'
      icon={<Bell />}
      aria-label={iconOnly ? 'Notifications' : undefined}
    >
      {iconOnly ? null : 'Notifications'}
    </Tabs.Trigger>
  </>
);

const DemoContent = () => (
  <>
    <Tabs.Content value='home'>
      <div>Home content — dashboard information and recent activity.</div>
    </Tabs.Content>

    <Tabs.Content value='profile'>
      <div>Profile content — personal details and preferences.</div>
    </Tabs.Content>

    <Tabs.Content value='settings'>
      <div>Settings content — application configuration options.</div>
    </Tabs.Content>

    <Tabs.Content value='notifications'>
      <div>Notifications content — alerts and delivery settings.</div>
    </Tabs.Content>
  </>
);

const FileTriggers = () => (
  <>
    <Tabs.Trigger value='files' icon={<Folder />}>
      Files
    </Tabs.Trigger>

    <Tabs.Trigger value='images' icon={<Image />}>
      Images
    </Tabs.Trigger>

    <Tabs.Trigger value='music' icon={<Headphones />}>
      Music
    </Tabs.Trigger>
  </>
);

const FileContent = () => (
  <>
    <Tabs.Content value='files'>
      <ul>
        <li>document.pdf</li>
        <li>presentation.pptx</li>
        <li>spreadsheet.xlsx</li>
      </ul>
    </Tabs.Content>

    <Tabs.Content value='images'>
      <ul>
        <li>photo.jpg</li>
        <li>screenshot.png</li>
        <li>illustration.svg</li>
      </ul>
    </Tabs.Content>

    <Tabs.Content value='music'>
      <ul>
        <li>song.mp3</li>
        <li>podcast.wav</li>
        <li>playlist.m3u</li>
      </ul>
    </Tabs.Content>
  </>
);

const ControlledDemo = () => {
  const [value, setValue] = useState('home');

  return (
    <div style={stackStyle}>
      <p style={currentValueStyle}>
        Current value: <strong>{value}</strong>
      </p>

      <Tabs value={value} onValueChange={setValue}>
        <Tabs.List aria-label='Controlled account sections'>
          <DemoTriggers />
        </Tabs.List>

        <DemoContent />
      </Tabs>
    </div>
  );
};

const DynamicTriggersDemo = () => {
  const [showProfile, setShowProfile] = useState(true);

  return (
    <div style={stackStyle}>
      <button
        type='button'
        onClick={() => setShowProfile((current) => !current)}
      >
        Toggle profile
      </button>

      <Tabs defaultValue='home'>
        <Tabs.List aria-label='Dynamic account sections'>
          <Tabs.Trigger value='home'>Home</Tabs.Trigger>
          {showProfile && <Tabs.Trigger value='profile'>Profile</Tabs.Trigger>}
          <Tabs.Trigger value='settings'>Settings</Tabs.Trigger>
        </Tabs.List>

        <Tabs.Content value='home'>Home content</Tabs.Content>
        {showProfile && (
          <Tabs.Content value='profile'>Profile content</Tabs.Content>
        )}
        <Tabs.Content value='settings'>Settings content</Tabs.Content>
      </Tabs>
    </div>
  );
};

export const Basic: Story = {
  render: (args) => (
    <Section title='Basic'>
      <Tabs {...args}>
        <Tabs.List aria-label='Account sections'>
          <DemoTriggers />
          {args.variant !== 'pills' && <Tabs.Indicator />}
        </Tabs.List>

        <DemoContent />
      </Tabs>
    </Section>
  ),
};

export const Controlled: Story = {
  render: () => (
    <Section title='Controlled'>
      <ControlledDemo />
    </Section>
  ),
};

export const DefaultValue: Story = {
  render: () => (
    <Section title='Default value'>
      <Tabs defaultValue='settings'>
        <Tabs.List aria-label='Default value example'>
          <DemoTriggers />
        </Tabs.List>

        <DemoContent />
      </Tabs>
    </Section>
  ),
};

export const Variants: Story = {
  render: () => (
    <div style={stackStyle}>
      {(['line', 'pills', 'segmented'] as const).map((variant) => (
        <Section key={variant} title={variant}>
          <Tabs defaultValue='home' variant={variant}>
            <Tabs.List aria-label={`${variant} variant`}>
              <DemoTriggers />
              {variant !== 'pills' && <Tabs.Indicator />}
            </Tabs.List>

            <DemoContent />
          </Tabs>
        </Section>
      ))}
    </div>
  ),
};

export const Colors: Story = {
  render: () => (
    <div style={stackStyle}>
      {(['primary', 'neutral', 'success', 'warning', 'danger'] as const).map(
        (color) => (
          <Section key={color} title={color}>
            <Tabs defaultValue='home' color={color} variant='pills'>
              <Tabs.List aria-label={`${color} tabs`}>
                <DemoTriggers />
              </Tabs.List>

              <DemoContent />
            </Tabs>
          </Section>
        )
      )}
    </div>
  ),
};

export const Sizes: Story = {
  render: () => (
    <div style={stackStyle}>
      {(['sm', 'md', 'lg'] as const).map((size) => (
        <Section key={size} title={size}>
          <Tabs defaultValue='home' size={size}>
            <Tabs.List aria-label={`${size} tabs`}>
              <DemoTriggers />
            </Tabs.List>

            <DemoContent />
          </Tabs>
        </Section>
      ))}
    </div>
  ),
};

export const Horizontal: Story = {
  render: () => (
    <Section title='Horizontal'>
      <Tabs defaultValue='home' orientation='horizontal'>
        <Tabs.List aria-label='Horizontal account sections'>
          <DemoTriggers />
        </Tabs.List>

        <DemoContent />
      </Tabs>
    </Section>
  ),
};

export const Vertical: Story = {
  render: () => (
    <Section title='Vertical'>
      <Tabs defaultValue='home' orientation='vertical'>
        <Tabs.List aria-label='Vertical account sections'>
          <DemoTriggers />
        </Tabs.List>

        <DemoContent />
      </Tabs>
    </Section>
  ),
};

export const AutomaticActivation: Story = {
  parameters: {
    docs: {
      description: {
        story:
          'Arrow-key navigation moves focus and immediately activates the focused trigger.',
      },
    },
  },

  render: () => (
    <Section title='Automatic activation'>
      <Tabs defaultValue='home' activationMode='automatic'>
        <Tabs.List aria-label='Automatic activation example'>
          <DemoTriggers />
        </Tabs.List>

        <DemoContent />
      </Tabs>
    </Section>
  ),
};

export const ManualActivation: Story = {
  parameters: {
    docs: {
      description: {
        story:
          'Arrow-key navigation moves focus without changing content. Press Enter or Space to activate the focused trigger.',
      },
    },
  },

  render: () => (
    <Section title='Manual activation'>
      <Tabs defaultValue='home' activationMode='manual'>
        <Tabs.List aria-label='Manual activation example'>
          <DemoTriggers />
        </Tabs.List>

        <DemoContent />
      </Tabs>
    </Section>
  ),
};

export const DisabledTrigger: Story = {
  render: () => (
    <Section title='Disabled trigger'>
      <Tabs defaultValue='home'>
        <Tabs.List aria-label='Disabled trigger example'>
          <DemoTriggers disabledSettings />
        </Tabs.List>

        <DemoContent />
      </Tabs>
    </Section>
  ),
};

export const Icons: Story = {
  render: () => (
    <Section title='Icons'>
      <Tabs defaultValue='home' variant='pills'>
        <Tabs.List aria-label='Icon-only tabs'>
          <DemoTriggers iconOnly />
        </Tabs.List>

        <DemoContent />
      </Tabs>
    </Section>
  ),
};

export const Badges: Story = {
  render: () => (
    <Section title='Badges'>
      <Tabs defaultValue='notifications' variant='pills'>
        <Tabs.List aria-label='Badge tabs'>
          <Tabs.Trigger value='home'>Home</Tabs.Trigger>
          <Tabs.Trigger value='notifications' badge={3}>
            Notifications
          </Tabs.Trigger>
          <Tabs.Trigger value='settings' badge='New'>
            Settings
          </Tabs.Trigger>
        </Tabs.List>

        <DemoContent />
      </Tabs>
    </Section>
  ),
};

export const RichTrigger: Story = {
  render: () => (
    <Section title='Rich trigger'>
      <Tabs defaultValue='settings' variant='segmented'>
        <Tabs.List aria-label='Rich trigger tabs'>
          <Tabs.Trigger value='home'>
            <Tabs.Icon>
              <Home />
            </Tabs.Icon>
            <span>Home</span>
          </Tabs.Trigger>

          <Tabs.Trigger value='settings'>
            <Tabs.Icon>
              <Settings />
            </Tabs.Icon>
            <span>Settings</span>
            <Tabs.Badge>New</Tabs.Badge>
          </Tabs.Trigger>
          <Tabs.Indicator />
        </Tabs.List>

        <Tabs.Content value='home'>Home content</Tabs.Content>
        <Tabs.Content value='settings'>Settings content</Tabs.Content>
      </Tabs>
    </Section>
  ),
};

export const Indicator: Story = {
  render: () => (
    <Section title='Indicator'>
      <Tabs defaultValue='home' variant='segmented'>
        <Tabs.List aria-label='Indicator tabs'>
          <DemoTriggers />
          <Tabs.Indicator />
        </Tabs.List>

        <DemoContent />
      </Tabs>
    </Section>
  ),
};

export const Scrollable: Story = {
  render: () => (
    <Section title='Scrollable'>
      <Tabs defaultValue='home'>
        <Tabs.List aria-label='Scrollable tabs' scrollable>
          <DemoTriggers />
          <FileTriggers />
        </Tabs.List>

        <DemoContent />
        <FileContent />
      </Tabs>
    </Section>
  ),
};

export const LazyMount: Story = {
  render: () => (
    <Section title='Lazy mount'>
      <Tabs defaultValue='home' lazyMount>
        <Tabs.List aria-label='Lazy mounted tabs'>
          <DemoTriggers />
        </Tabs.List>

        <DemoContent />
      </Tabs>
    </Section>
  ),
};

export const KeepMounted: Story = {
  render: () => (
    <Section title='Keep mounted'>
      <Tabs defaultValue='home' keepMounted>
        <Tabs.List aria-label='Keep mounted tabs'>
          <DemoTriggers />
        </Tabs.List>

        <DemoContent />
      </Tabs>
    </Section>
  ),
};

export const LazyKeepMounted: Story = {
  render: () => (
    <Section title='Lazy keep mounted'>
      <Tabs defaultValue='home' lazyMount keepMounted>
        <Tabs.List aria-label='Lazy keep mounted tabs'>
          <DemoTriggers />
        </Tabs.List>

        <DemoContent />
      </Tabs>
    </Section>
  ),
};

export const DynamicTriggers: Story = {
  render: () => (
    <Section title='Dynamic triggers'>
      <DynamicTriggersDemo />
    </Section>
  ),
};

export const RTL: Story = {
  render: () => (
    <Section title='RTL'>
      <Tabs defaultValue='home' dir='rtl'>
        <Tabs.List aria-label='RTL tabs'>
          <DemoTriggers />
        </Tabs.List>

        <DemoContent />
      </Tabs>
    </Section>
  ),
};

export const CustomContent: Story = {
  render: () => (
    <Section title='Custom content'>
      <Tabs defaultValue='files'>
        <Tabs.List aria-label='File categories'>
          <FileTriggers />
        </Tabs.List>

        <FileContent />
      </Tabs>
    </Section>
  ),
};
