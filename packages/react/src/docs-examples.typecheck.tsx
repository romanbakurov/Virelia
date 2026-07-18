import { useState } from 'react';

import { Select } from './components/Select';
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

const countryOptions = [
  { label: 'France', value: 'fr' },
  { label: 'Germany', value: 'de' },
  { label: 'Spain', value: 'es' },
];

function CountryItems() {
  return (
    <>
      {countryOptions.map((option) => (
        <Select.Item key={option.value} value={option.value}>
          {option.label}
        </Select.Item>
      ))}
    </>
  );
}

export function WebSelectValueChangeExample() {
  const [country, setCountry] = useState('fr');

  return (
    <Select
      label='Country'
      value={country}
      onValueChange={setCountry}
      color='primary'
      variant='outline'
      size='md'
      placeholder='Choose country'
      disabled={false}
      required
      invalid={false}
      clearable
      searchable
      loading={false}
      open={false}
      defaultOpen={false}
      onOpenChange={() => undefined}
    >
      <Select.Trigger />
      <Select.Content>
        <CountryItems />
      </Select.Content>
    </Select>
  );
}

export function WebSelectMultipleValueChangeExample() {
  const [countries, setCountries] = useState<string[]>(['fr']);

  return (
    <Select
      label='Countries'
      multiple
      value={countries}
      onValueChange={setCountries}
      maxSelected={2}
      closeOnSelect={false}
    >
      <CountryItems />
    </Select>
  );
}
