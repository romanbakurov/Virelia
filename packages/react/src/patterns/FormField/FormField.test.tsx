import { afterEach, describe, expect, it } from 'vitest';

import { render } from '../../test-utils/render';

import { FormField } from './FormField';

afterEach(() => {
  document.body.innerHTML = '';
});

describe('FormField', () => {
  it('connects label, description and error content to the control id', () => {
    const { container, unmount } = render(
      <FormField
        id='name'
        label='Name'
        description='Use your legal name.'
        required
        error='Name is required'
      >
        <input
          id='name'
          aria-describedby='name-description name-error'
          aria-invalid
        />
      </FormField>
    );

    const root = container.firstElementChild;
    const label = container.querySelector('label');
    const description = container.querySelector('#name-description');
    const alert = container.querySelector('[role="alert"]');

    expect(root?.id).toBe('');
    expect(label?.getAttribute('for')).toBe('name');
    expect(label?.textContent).toContain('Name');
    expect(label?.textContent).toContain('*');
    expect(description?.textContent).toBe('Use your legal name.');
    expect(alert?.id).toBe('name-error');
    expect(alert?.textContent).toBe('Name is required');

    unmount();
  });

  it('renders custom label, description and error nodes', () => {
    const { container, unmount } = render(
      <FormField
        id='workspace'
        label={<span data-testid='custom-label'>Workspace</span>}
        description={
          <span data-testid='custom-description'>Visible in URLs</span>
        }
        error={<span data-testid='custom-error'>Already taken</span>}
      >
        <input id='workspace' />
      </FormField>
    );

    expect(
      container.querySelector('[data-testid="custom-label"]')?.textContent
    ).toBe('Workspace');
    expect(
      container.querySelector('[data-testid="custom-description"]')
        ?.parentElement?.id
    ).toBe('workspace-description');
    expect(
      container.querySelector('[data-testid="custom-error"]')?.parentElement?.id
    ).toBe('workspace-error');

    unmount();
  });

  it('exposes disabled and invalid state on the root wrapper', () => {
    const { container, unmount } = render(
      <FormField id='email' label='Email' disabled error='Email is required'>
        <input id='email' disabled />
      </FormField>
    );

    const root = container.firstElementChild;

    expect(root?.getAttribute('aria-disabled')).toBe('true');
    expect(root?.getAttribute('data-disabled')).toBe('true');
    expect(root?.getAttribute('data-invalid')).toBe('true');

    unmount();
  });

  it('applies root and slot class names while forwarding safe div props', () => {
    const { container, unmount } = render(
      <FormField
        id='project'
        label='Project'
        description='Shown in the dashboard.'
        error='Project is required.'
        className='root-class'
        labelClassName='label-class'
        descriptionClassName='description-class'
        controlClassName='control-class'
        errorClassName='error-class'
        data-testid='field'
      >
        <input id='project' />
      </FormField>
    );

    const root = container.querySelector('[data-testid="field"]');
    const label = container.querySelector('label');
    const description = container.querySelector('#project-description');
    const control = container.querySelector('input')?.parentElement;
    const error = container.querySelector('#project-error');

    expect(root?.className).toContain('root-class');
    expect(label?.className).toContain('label-class');
    expect(description?.className).toContain('description-class');
    expect(control?.className).toContain('control-class');
    expect(error?.className).toContain('error-class');

    unmount();
  });

  it('omits generated supporting ids when no control id is provided', () => {
    const { container, unmount } = render(
      <FormField
        label='Loose field'
        description='Detached hint.'
        error='Error.'
      >
        <input />
      </FormField>
    );

    const label = container.querySelector('label');
    const description = Array.from(container.querySelectorAll('div')).find(
      (node) => node.textContent === 'Detached hint.'
    );
    const error = container.querySelector('[role="alert"]');

    expect(label?.hasAttribute('for')).toBe(false);
    expect(description?.hasAttribute('id')).toBe(false);
    expect(error?.hasAttribute('id')).toBe(false);

    unmount();
  });
});
