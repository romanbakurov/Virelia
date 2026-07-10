import { useState } from 'react';

import { Input } from './primitives/Input';

export function WebInputDomOnChangeExample() {
  const [email, setEmail] = useState('');

  return (
    <Input
      label='Email'
      value={email}
      onChange={(event) => {
        const input: HTMLInputElement = event.currentTarget;

        setEmail(input.value);
        setEmail(event.target.value);
      }}
      type='email'
      placeholder='name@example.com'
    />
  );
}
