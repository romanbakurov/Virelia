import { describe, it } from 'vitest';

import { expectNoA11yViolations } from '../../test-utils/a11y';
import { render } from '../../test-utils/render';

import { RadioGroup } from './RadioGroup';

import { Radio } from '#primitives/Radio';

describe('RadioGroup accessibility', () => {
  it('has no axe violations with label, description, and error', async () => {
    const { container, unmount } = render(
      <RadioGroup
        id='delivery'
        label='Delivery method'
        description='Choose one delivery option.'
        error='Delivery method is required.'
        required
      >
        <Radio value='standard' label='Standard' />
        <Radio value='express' label='Express' />
      </RadioGroup>
    );

    await expectNoA11yViolations(container);

    unmount();
  });
});
