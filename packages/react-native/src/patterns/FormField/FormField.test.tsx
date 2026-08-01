import { afterEach, describe, expect, it } from 'vitest';

import { render } from '../../test-utils/render';

import { FormField } from './FormField';

afterEach(() => {
  document.body.innerHTML = '';
});

describe('Native FormField', () => {
  it('renders string content with hidden required marker and polite error updates', () => {
    const { container, unmount } = render(
      <FormField
        label='Email'
        description='Used for account notifications.'
        required
        error='Email is required'
      >
        <input aria-label='Email' />
      </FormField>
    );

    expect(container.textContent).toContain('Email');
    expect(container.textContent).toContain('Used for account notifications.');
    expect(container.textContent).toContain('*');
    expect(container.textContent).toContain('Email is required');

    const requiredMark = container.querySelector('[aria-hidden="true"]');
    const error = container.querySelector('[aria-live="polite"]');

    expect(requiredMark?.textContent).toBe(' *');
    expect(requiredMark?.getAttribute('data-important-for-accessibility')).toBe(
      'no'
    );
    expect(error?.textContent).toBe('Email is required');

    unmount();
  });

  it('renders custom label, description and error nodes without wrapping them in text', () => {
    const { container, unmount } = render(
      <FormField
        label={<span data-testid='custom-label'>Workspace</span>}
        description={<span data-testid='custom-description'>Public URL</span>}
        error={<span data-testid='custom-error'>Already taken</span>}
      >
        <input aria-label='Workspace' />
      </FormField>
    );

    expect(
      container.querySelector('[data-testid="custom-label"]')?.textContent
    ).toBe('Workspace');
    expect(
      container.querySelector('[data-testid="custom-description"]')?.textContent
    ).toBe('Public URL');

    const errorRegion = container
      .querySelector('[data-testid="custom-error"]')
      ?.closest('[aria-live="polite"]');

    expect(errorRegion?.textContent).toBe('Already taken');

    unmount();
  });

  it('renders supporting messages without live updates by default', () => {
    const { container, unmount } = render(
      <FormField
        label='Email'
        description='Used for account notifications.'
        message='Email address is available.'
        messageTone='success'
      >
        <input aria-label='Email' />
      </FormField>
    );

    const message = Array.from(container.querySelectorAll('span')).find(
      (node) => node.textContent === 'Email address is available.'
    );

    expect(message).toBeTruthy();
    expect(message?.getAttribute('aria-live')).toBeNull();

    unmount();
  });

  it('supports compound slots for label, description, control and message', () => {
    const { container, unmount } = render(
      <FormField required>
        <FormField.Label>Email</FormField.Label>
        <FormField.Description>Used for notifications.</FormField.Description>
        <FormField.Control>
          <input aria-label='Email' />
        </FormField.Control>
        <FormField.Message tone='success' live='polite'>
          Email address is available.
        </FormField.Message>
      </FormField>
    );

    expect(container.textContent).toContain('Email');
    expect(container.textContent).toContain('Used for notifications.');
    expect(container.textContent).toContain('*');

    const message = container.querySelector('[aria-live="polite"]');

    expect(message?.textContent).toBe('Email address is available.');

    unmount();
  });

  it('supports polite message updates when requested', () => {
    const { container, unmount } = render(
      <FormField
        label='API key'
        message='This key expires in 7 days.'
        messageLive='polite'
      >
        <input aria-label='API key' />
      </FormField>
    );

    const message = container.querySelector('[aria-live="polite"]');

    expect(message?.textContent).toBe('This key expires in 7 days.');

    unmount();
  });

  it('gives error content priority over a supporting message', () => {
    const { container, unmount } = render(
      <FormField
        label='Project slug'
        message='Slug is available.'
        error='This slug is already used.'
      >
        <input aria-label='Project slug' />
      </FormField>
    );

    expect(container.textContent).not.toContain('Slug is available.');

    const error = container.querySelector('[aria-live="polite"]');

    expect(error?.textContent).toBe('This slug is already used.');

    unmount();
  });

  it('renders label actions outside the label text', () => {
    const { container, unmount } = render(
      <FormField
        label='Password'
        labelAction={<button type='button'>Forgot?</button>}
      >
        <input aria-label='Password' />
      </FormField>
    );

    const label = Array.from(container.querySelectorAll('span')).find(
      (node) => node.textContent === 'Password'
    );
    const action = container.querySelector('button');

    expect(label?.textContent).toBe('Password');
    expect(action?.textContent).toBe('Forgot?');
    expect(label?.contains(action)).toBe(false);

    unmount();
  });

  it('marks the root disabled for assistive technology and keeps children responsible for interaction state', () => {
    const { container, unmount } = render(
      <FormField testID='field' label='Email' disabled>
        <input aria-label='Email' disabled />
      </FormField>
    );

    const field = container.querySelector('[data-testid="field"]');
    const control = container.querySelector('input');

    expect(field?.getAttribute('aria-disabled')).toBe('true');
    expect(control?.hasAttribute('disabled')).toBe(true);

    unmount();
  });

  it('applies style overrides to the root, control, label, description and message slots', () => {
    const { container, unmount } = render(
      <FormField
        testID='field'
        label='Project'
        description='Visible in the workspace.'
        message='Project is available.'
        style={{ maxWidth: 320 }}
        controlStyle={{ marginTop: 4 }}
        labelStyle={{ fontWeight: '700' }}
        descriptionStyle={{ fontStyle: 'italic' }}
        messageStyle={{ textDecorationLine: 'underline' }}
      >
        <input aria-label='Project' />
      </FormField>
    );

    const field = container.querySelector<HTMLElement>('[data-testid="field"]');
    const label = Array.from(container.querySelectorAll('span')).find((node) =>
      node.textContent?.includes('Project')
    );
    const description = Array.from(container.querySelectorAll('span')).find(
      (node) => node.textContent === 'Visible in the workspace.'
    );
    const message = Array.from(
      container.querySelectorAll<HTMLElement>('span')
    ).find((node) => node.textContent === 'Project is available.');
    const controlWrapper = container.querySelector('input')?.parentElement;

    expect(field?.style.maxWidth).toBe('320px');
    expect(controlWrapper?.style.marginTop).toBe('4px');
    expect(label?.style.fontWeight).toBe('700');
    expect(description?.style.fontStyle).toBe('italic');
    expect(message?.style.textDecorationLine).toBe('underline');

    unmount();
  });
});
