# Component Overview

Explore the available Vellira components and their common states before diving
into the renderer-specific API documentation.

Use this page as a visual overview of the component library.

> 💡 Looking for interactive examples?
>
> Open Storybook →
> [Open Storybook](https://storybook.vellira.dev)

## Visual States

<div class="docs-state-gallery">
  <section class="docs-state-card">
    <header>
      <h3>Button</h3>
      <a href="https://storybook.vellira.dev/?path=/docs/primitives-button--docs">Storybook</a>
    </header>
    <div class="docs-state-grid">
      <div><span>Default</span><button class="docs-button">Save</button></div>
      <div><span>Hover</span><button class="docs-button docs-is-hover">Save</button></div>
      <div><span>Focus</span><button class="docs-button docs-is-focus">Save</button></div>
      <div><span>Disabled</span><button class="docs-button" disabled>Save</button></div>
      <div><span>Loading</span><button class="docs-button docs-is-loading">Saving</button></div>
      <div><span>Danger</span><button class="docs-button docs-button-danger">Delete</button></div>
    </div>
  </section>

  <section class="docs-state-card">
    <header>
      <h3>Input</h3>
      <a href="https://storybook.vellira.dev/?path=/docs/primitives-input--docs">Storybook</a>
    </header>
    <div class="docs-state-grid">
      <div><span>Default</span><input class="docs-input" value="name@example.com" /></div>
      <div><span>Focus</span><input class="docs-input docs-is-focus" value="name@example.com" /></div>
      <div><span>Disabled</span><input class="docs-input" value="name@example.com" disabled /></div>
      <div><span>Error</span><input class="docs-input docs-input-error" value="invalid" /><small>Enter a valid email.</small></div>
    </div>
  </section>

  <section class="docs-state-card">
    <header>
      <h3>Checkbox</h3>
      <a href="https://storybook.vellira.dev/?path=/docs/primitives-checkbox--docs">Storybook</a>
    </header>
    <div class="docs-state-grid">
      <div><span>Default</span><label class="docs-check"><input type="checkbox" />Remember</label></div>
      <div><span>Checked</span><label class="docs-check"><input type="checkbox" checked />Remember</label></div>
      <div><span>Focus</span><label class="docs-check docs-is-focus"><input type="checkbox" checked />Remember</label></div>
      <div><span>Disabled</span><label class="docs-check docs-is-disabled"><input type="checkbox" checked disabled />Remember</label></div>
      <div><span>Error</span><label class="docs-check docs-has-error"><input type="checkbox" />Required</label></div>
    </div>
  </section>

  <section class="docs-state-card">
    <header>
      <h3>Select</h3>
      <a href="https://storybook.vellira.dev/?path=/docs/components-select--docs">Storybook</a>
    </header>
    <div class="docs-state-grid">
      <div><span>Default</span><div class="docs-select">Admin <span>v</span></div></div>
      <div><span>Focus</span><div class="docs-select docs-is-focus">Admin <span>v</span></div></div>
      <div><span>Disabled</span><div class="docs-select docs-is-disabled">Admin <span>v</span></div></div>
      <div><span>Error</span><div class="docs-select docs-input-error">Choose role <span>v</span></div><small>Role is required.</small></div>
    </div>
  </section>

  <section class="docs-state-card">
    <header>
      <h3>RadioGroup</h3>
      <a href="https://storybook.vellira.dev/?path=/docs/components-radiogroup--docs">Storybook</a>
    </header>
    <div class="docs-state-grid">
      <div><span>Default</span><div class="docs-radio-row"><i class="docs-radio docs-radio-active"></i>System</div></div>
      <div><span>Focus</span><div class="docs-radio-row docs-is-focus"><i class="docs-radio docs-radio-active"></i>System</div></div>
      <div><span>Disabled</span><div class="docs-radio-row docs-is-disabled"><i class="docs-radio"></i>Manual</div></div>
      <div><span>Error</span><div class="docs-radio-row docs-has-error"><i class="docs-radio"></i>Required</div></div>
    </div>
  </section>

  <section class="docs-state-card">
    <header>
      <h3>Tabs</h3>
      <a href="https://storybook.vellira.dev/?path=/docs/components-tabs--docs">Storybook</a>
    </header>
    <div class="docs-state-grid">
      <div><span>Default</span><div class="docs-tabs"><button class="docs-tab docs-tab-active">Profile</button><button class="docs-tab">Security</button></div></div>
      <div><span>Focus</span><div class="docs-tabs"><button class="docs-tab docs-tab-active docs-is-focus">Profile</button><button class="docs-tab">Security</button></div></div>
      <div><span>Disabled</span><div class="docs-tabs"><button class="docs-tab docs-tab-active">Profile</button><button class="docs-tab" disabled>Billing</button></div></div>
      <div><span>Mobile width</span><div class="docs-mobile-frame"><div class="docs-tabs"><button class="docs-tab docs-tab-active">Plan</button><button class="docs-tab">Usage</button></div></div></div>
    </div>
  </section>

  <section class="docs-state-card">
    <header>
      <h3>Dropdown</h3>
      <a href="https://storybook.vellira.dev/?path=/docs/components-dropdown--docs">Storybook</a>
    </header>
    <div class="docs-state-grid">
      <div><span>Default</span><button class="docs-button docs-button-secondary">Actions</button></div>
      <div><span>Open</span><div class="docs-menu docs-menu-static"><div>Edit</div><div>Duplicate</div><div class="docs-menu-danger">Delete</div></div></div>
      <div><span>Danger item</span><div class="docs-menu docs-menu-static"><div>Archive</div><div class="docs-menu-danger">Delete</div></div></div>
      <div><span>Disabled</span><button class="docs-button docs-button-secondary" disabled>Actions</button></div>
    </div>
  </section>

  <section class="docs-state-card">
    <header>
      <h3>Tooltip</h3>
      <a href="https://storybook.vellira.dev/?path=/docs/components-tooltip--docs">Storybook</a>
    </header>
    <div class="docs-state-grid">
      <div><span>Default</span><button class="docs-button docs-button-secondary">Info</button></div>
      <div><span>Open</span><div class="docs-tooltip">Helpful context</div></div>
      <div><span>Focused</span><button class="docs-button docs-button-secondary docs-is-focus">Info</button></div>
      <div><span>Disabled</span><button class="docs-button docs-button-secondary" disabled>Info</button></div>
    </div>
  </section>

  <section class="docs-state-card">
    <header>
      <h3>Modal</h3>
      <a href="https://storybook.vellira.dev/?path=/docs/components-modal--docs">Storybook</a>
    </header>
    <div class="docs-state-grid">
      <div>
        <span>Default</span>
        <div class="docs-modal-preview">
          <strong>Confirm action</strong>
          <span>This dialog needs a decision.</span>
          <div class="docs-modal-actions">
            <button class="docs-button docs-button-secondary">Cancel</button>
            <button class="docs-button docs-button-danger">Delete</button>
          </div>
        </div>
      </div>
      <div>
        <span>Mobile</span>
        <div class="docs-mobile-frame">
          <div class="docs-modal-preview">
            <strong>Delete item</strong>
            <span>Confirm this change.</span>
            <div class="docs-modal-actions">
              <button class="docs-button docs-button-secondary">Cancel</button>
              <button class="docs-button docs-button-danger">Delete</button>
            </div>
          </div>
        </div>
      </div>
    </div>
  </section>
</div>

## Common Patterns

### Form

```tsx
import { Button, Checkbox, Input } from '@vellira-ui/react';
import { useState } from 'react';

export function FormExample() {
  const [email, setEmail] = useState('');

  return (
    <form>
      <Input
        label='Email'
        value={email}
        onChange={setEmail}
        placeholder='name@example.com'
      />
      <Checkbox label='Remember this device' defaultChecked />
      <Button variant='primary'>Continue</Button>
    </form>
  );
}
```

### Selection

```tsx
import { RadioGroup, Select } from '@vellira-ui/react';

export function SelectionExample() {
  return (
    <>
      <RadioGroup
        name='theme'
        label='Theme'
        options={[
          { label: 'System theme', value: 'system' },
          { label: 'Light theme', value: 'light' },
        ]}
      />
      <Select
        label='Role'
        options={[
          { label: 'Admin', value: 'admin' },
          { label: 'Editor', value: 'editor' },
          { label: 'Viewer', value: 'viewer' },
        ]}
      />
    </>
  );
}
```

### Overlay

```tsx
import { Dropdown } from '@vellira-ui/react';

export function OverlayExample() {
  const handleAction = (value: string) => {
    // Handle selected action.
  };

  return (
    <Dropdown
      label='Open menu'
      items={[
        { label: 'Copy', value: 'copy' },
        { label: 'Rename', value: 'rename' },
        { label: 'Delete', value: 'delete', danger: true },
      ]}
      onSelect={handleAction}
    />
  );
}
```

## Where to Go Next

| Goal                                   | Page                                      |
| -------------------------------------- | ----------------------------------------- |
| Install and render the first component | [Quick Start](/getting-started)           |
| Learn Web package details              | [Web](/web)                               |
| Learn Native package details           | [Native](/native)                         |
| Understand token layers                | [Theme Architecture](/theme-architecture) |

## Supported Components

- Button
- Checkbox
- Dropdown
- Input
- Modal
- RadioGroup
- Select
- Tabs
- Tooltip

More components are added continuously.
