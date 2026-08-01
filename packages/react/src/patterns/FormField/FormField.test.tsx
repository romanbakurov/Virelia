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
        optionalText=''
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

  it('exposes invalid state without requiring visible error text', () => {
    const { container, unmount } = render(
      <FormField id='email' label='Email' invalid>
        <input id='email' aria-invalid />
      </FormField>
    );

    const root = container.firstElementChild;

    expect(root?.getAttribute('data-invalid')).toBe('true');
    expect(container.querySelector('[role="alert"]')).toBeNull();

    unmount();
  });

  it('binds control ids and aria metadata to a direct child control', () => {
    const { container, unmount } = render(
      <FormField
        label='Email'
        description='Used for login.'
        error='Invalid email.'
        required
        invalid
      >
        <input />
      </FormField>
    );

    const input = container.querySelector('input');
    const label = container.querySelector('label');
    const description = container.querySelector('[id$="-description"]');
    const error = container.querySelector('[id$="-error"]');

    expect(input?.id).toBeTruthy();
    expect(label?.getAttribute('for')).toBe(input?.id);
    expect(input?.required).toBe(true);
    expect(input?.getAttribute('aria-invalid')).toBe('true');
    expect(input?.getAttribute('aria-labelledby')).toBe(`${input?.id}-label`);
    expect(input?.getAttribute('aria-describedby')).toBe(
      `${description?.id} ${error?.id}`
    );

    unmount();
  });

  it('links a supporting message to a direct child control', () => {
    const { container, unmount } = render(
      <FormField
        id='email'
        label='Email'
        description='Used for account notifications.'
        message='Email address is available.'
        messageTone='success'
      >
        <input />
      </FormField>
    );

    const input = container.querySelector('input');
    const message = container.querySelector('#email-message');

    expect(message?.textContent).toBe('Email address is available.');
    expect(input?.getAttribute('aria-describedby')).toBe(
      'email-description email-message'
    );
    expect(container.querySelector('[role="alert"]')).toBeNull();

    unmount();
  });

  it('supports compound slots for label, description, control and message', () => {
    const { container, unmount } = render(
      <FormField id='compound-email' required>
        <FormField.Label>Email</FormField.Label>
        <FormField.Description>Used for notifications.</FormField.Description>
        <FormField.Control>
          <input />
        </FormField.Control>
        <FormField.Message tone='success' live='polite'>
          Email address is available.
        </FormField.Message>
      </FormField>
    );

    const input = container.querySelector('input');
    const label = container.querySelector('label');
    const description = container.querySelector('#compound-email-description');
    const message = container.querySelector('#compound-email-message');

    expect(label?.getAttribute('for')).toBe('compound-email');
    expect(label?.textContent).toContain('Email');
    expect(label?.textContent).toContain('*');
    expect(description?.textContent).toBe('Used for notifications.');
    expect(message?.textContent).toBe('Email address is available.');
    expect(message?.getAttribute('aria-live')).toBe('polite');
    expect(input?.id).toBe('compound-email');
    expect(input?.required).toBe(true);
    expect(input?.getAttribute('aria-labelledby')).toBe('compound-email-label');
    expect(input?.getAttribute('aria-describedby')).toBe(
      'compound-email-description compound-email-message'
    );

    unmount();
  });

  it('lets FormField.Control opt out of automatic child binding', () => {
    const { container, unmount } = render(
      <FormField id='compound-manual'>
        <FormField.Label>Manual</FormField.Label>
        <FormField.Control bindControl={false}>
          <input />
        </FormField.Control>
      </FormField>
    );

    expect(container.querySelector('input')?.id).toBe('');

    unmount();
  });

  it('gives error content priority over a supporting message', () => {
    const { container, unmount } = render(
      <FormField
        id='slug'
        label='Project slug'
        message='Slug is available.'
        error='This slug is already used.'
      >
        <input />
      </FormField>
    );

    const input = container.querySelector('input');
    const error = container.querySelector('#slug-error');

    expect(container.querySelector('#slug-message')).toBeNull();
    expect(error?.getAttribute('role')).toBe('alert');
    expect(error?.textContent).toBe('This slug is already used.');
    expect(input?.getAttribute('aria-invalid')).toBe('true');
    expect(input?.getAttribute('aria-describedby')).toBe('slug-error');

    unmount();
  });

  it('keeps supporting messages quiet unless polite live updates are requested', () => {
    const { container, unmount } = render(
      <FormField
        id='api-key'
        label='API key'
        message='This key expires in 7 days.'
        messageLive='polite'
        messageClassName='message-class'
      >
        <input />
      </FormField>
    );

    const message = container.querySelector('#api-key-message');

    expect(message?.getAttribute('aria-live')).toBe('polite');
    expect(message?.className).toContain('message-class');

    unmount();
  });

  it('renders label actions outside the label element', () => {
    const { container, unmount } = render(
      <FormField
        id='password'
        label='Password'
        labelAction={<button type='button'>Forgot password?</button>}
      >
        <input />
      </FormField>
    );

    const label = container.querySelector('label');
    const action = container.querySelector('button');

    expect(label?.textContent).toBe('Password');
    expect(label?.contains(action)).toBe(false);

    unmount();
  });

  it('does not auto-bind fragments, multiple children or opt-out controls', () => {
    const { container, unmount, rerender } = render(
      <FormField id='fragment-field' label='Fragment field'>
        <>
          <input />
        </>
      </FormField>
    );

    expect(container.querySelector('input')?.id).toBe('');

    rerender(
      <FormField id='multi-field' label='Multiple field'>
        <input />
        <input />
      </FormField>
    );

    expect(container.querySelector('input')?.id).toBe('');

    rerender(
      <FormField id='manual-field' label='Manual field' bindControl={false}>
        <input />
      </FormField>
    );

    expect(container.querySelector('input')?.id).toBe('');

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

  it('generates supporting ids when no control id is provided', () => {
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
    const description = container.querySelector('[id$="-description"]');
    const error = container.querySelector('[role="alert"]');

    expect(label?.getAttribute('for')).toBeTruthy();
    expect(description?.id).toBeTruthy();
    expect(error?.id).toBeTruthy();

    unmount();
  });
});
