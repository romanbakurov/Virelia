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

  it('applies style overrides to the root, control, label, description and error slots', () => {
    const { container, unmount } = render(
      <FormField
        testID='field'
        label='Project'
        description='Visible in the workspace.'
        error='Project is required.'
        style={{ maxWidth: 320 }}
        controlStyle={{ marginTop: 4 }}
        labelStyle={{ fontWeight: '700' }}
        descriptionStyle={{ fontStyle: 'italic' }}
        errorStyle={{ textDecorationLine: 'underline' }}
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
    const error = container.querySelector<HTMLElement>('[aria-live="polite"]');
    const controlWrapper = container.querySelector('input')?.parentElement;

    expect(field?.style.maxWidth).toBe('320px');
    expect(controlWrapper?.style.marginTop).toBe('4px');
    expect(label?.style.fontWeight).toBe('700');
    expect(description?.style.fontStyle).toBe('italic');
    expect(error?.style.textDecorationLine).toBe('underline');

    unmount();
  });
});
