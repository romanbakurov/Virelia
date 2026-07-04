import { afterEach, describe, expect, it } from 'vitest';

import { render } from '../../test-utils/render';

import { Input } from './Input';

afterEach(() => {
  document.body.innerHTML = '';
});

describe('Native Input', () => {
  it('renders input props and error text', () => {
    const { container, unmount } = render(
      <Input
        label='Email'
        value='hello@vellira.dev'
        placeholder='name@company.com'
        error='Email is required'
        type='email'
      />
    );

    const input = container.querySelector<HTMLInputElement>('input');

    expect(input?.value).toBe('hello@vellira.dev');
    expect(input?.placeholder).toBe('name@company.com');
    expect(container.textContent).toContain('Email is required');

    unmount();
  });

  it('maps password type to secure input', () => {
    const { container, unmount } = render(
      <Input label='Password' value='' type='password' />
    );

    expect(container.querySelector('input')?.type).toBe('password');

    unmount();
  });
});
