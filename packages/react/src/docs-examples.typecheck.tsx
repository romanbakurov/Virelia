import { useState } from 'react';

import { Input } from './primitives/Input';

export function WebInputValueChangeExample() {
  const [email, setEmail] = useState('');

  return (
    <Input
      label='Email'
      value={email}
      onValueChange={setEmail}
      type='email'
      placeholder='name@example.com'
    />
  );
}
