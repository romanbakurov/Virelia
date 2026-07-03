# Quick Start

This guide gets you from installation to a working Vellira component in a few
minutes.

## 1. Install a Renderer

Use the package that matches your application.

::: code-group

```bash [Web]
pnpm add @romanbakurov/vellira-web
```

```bash [React Native]
pnpm add @romanbakurov/vellira-native
```

```bash [Tokens]
pnpm add @romanbakurov/vellira-tokens
```

:::

Install shared packages when you need icons or direct token access.

```bash
pnpm add @romanbakurov/vellira-icons @romanbakurov/vellira-tokens
```

If your project consumes packages from GitHub Packages, configure the scope
registry first.

```bash
@romanbakurov:registry=https://npm.pkg.github.com
```

## 2. Add Web Styles

Web apps should import Vellira styles once in the application entry point.

```tsx
import '@romanbakurov/vellira-web/styles';
```

React Native apps do not need a stylesheet import. Native components use React
Native styles and shared theme values internally.

## 3. Render Your First Component

### React Web

```tsx
import '@romanbakurov/vellira-web/styles';

import { Button, Checkbox, Input } from '@romanbakurov/vellira-web';
import { useState } from 'react';

export function SignInForm() {
  const [email, setEmail] = useState('');

  return (
    <form>
      <Input
        label='Email'
        value={email}
        onChange={setEmail}
        placeholder='name@example.com'
      />
      <Checkbox label='Remember me' />
      <Button variant='primary'>Continue</Button>
    </form>
  );
}
```

### React Native

```tsx
import { Button, Checkbox, Input } from '@romanbakurov/vellira-native';
import { useState } from 'react';
import { View } from 'react-native';

export function SignInScreen() {
  const [email, setEmail] = useState('');

  return (
    <View style={{ gap: 16, padding: 24 }}>
      <Input label='Email' value={email} onChange={setEmail} />
      <Checkbox label='Remember me' />
      <Button variant='primary'>Continue</Button>
    </View>
  );
}
```

## 4. Choose the Next Page

| Goal                      | Next page                                 |
| ------------------------- | ----------------------------------------- |
| See component patterns    | [Component Examples](/component-examples) |
| Use the Web package       | [Web](/web)                               |
| Use the Native package    | [Native](/native)                         |
| Understand theming        | [Theme Architecture](/theme-architecture) |
| Work with tokens directly | [Tokens](/tokens)                         |

## Local Development

Run the documentation site from the repository root.

```bash
pnpm docs:dev
```

Build it the same way CI does.

```bash
pnpm docs:build
```
