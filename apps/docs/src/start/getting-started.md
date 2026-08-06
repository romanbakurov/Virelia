---
title: Getting Started with Vellira
description: Learn how to install Vellira, set up React or React Native, import styles, and build your first interface with accessible UI components.
---

# Quick Start

This guide gets you from installation to a working Vellira component in a few
minutes.

## 1. Install a Renderer

Use the package that matches your application.

::: code-group

```bash [Web]
pnpm add @vellira-ui/react
```

```bash [React Native]
pnpm add @vellira-ui/react-native
```

:::

Optional packages are available when you need icons or direct token access.

::: code-group

```bash [Icons]
pnpm add @vellira-ui/icons
```

```bash [Tokens]
pnpm add @vellira-ui/tokens
```

:::

## 2. Add Web Styles

Web apps should import Vellira styles once in the application entry point.

```tsx
import '@vellira-ui/react/styles';
```

React Native apps do not need a stylesheet import. Native components use React
Native styles and shared theme values internally.

## 3. Render Your First Component

### React Web

```tsx
import '@vellira-ui/react/styles';

import { Button, Checkbox, Input } from '@vellira-ui/react';
import { useState } from 'react';

export function SignInForm() {
  const [email, setEmail] = useState('');
  const [remember, setRemember] = useState(false);

  return (
    <form>
      <Input
        label='Email'
        value={email}
        onValueChange={setEmail}
        placeholder='name@example.com'
      />
      <Checkbox
        label='Remember me'
        description='Keep this browser signed in.'
        checked={remember}
        onCheckedChange={setRemember}
      />
      <Button color='primary' appearance='solid'>
        Continue
      </Button>
    </form>
  );
}
```

### React Native

```tsx
import { Button, Checkbox, Input } from '@vellira-ui/react-native';
import { useState } from 'react';
import { View } from 'react-native';

export function SignInScreen() {
  const [email, setEmail] = useState('');
  const [remember, setRemember] = useState(false);

  return (
    <View style={{ gap: 16, padding: 24 }}>
      <Input label='Email' value={email} onValueChange={setEmail} />
      <Checkbox
        label='Remember me'
        description='Keep this device signed in.'
        checked={remember}
        onCheckedChange={setRemember}
      />
      <Button color='primary' appearance='solid'>
        Continue
      </Button>
    </View>
  );
}
```

## 4. Choose the Next Page

| Goal                      | Next page                                 |
| ------------------------- | ----------------------------------------- |
| See component patterns    | [Component Examples](/start/component-overview) |
| Use the Web package       | [Web](/react/)                               |
| Use the Native package    | [Native](/react-native/)                         |
| Understand theming        | [Theme Architecture](/design-system/theme-architecture) |
| Work with tokens directly | [Tokens](/design-system/tokens)                         |

## Local Development

Run the documentation site from the repository root.

```bash
pnpm docs:dev
```

Build it the same way CI does.

```bash
pnpm docs:build
```
