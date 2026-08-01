import { describe, expect, it } from 'vitest';

import { Portal } from '../../primitives/Portal';
import { expectNoA11yViolations } from '../../test-utils/a11y';
import { render } from '../../test-utils/render';

import { Tooltip } from './Tooltip';

describe('Tooltip accessibility', () => {
  it('has no accessibility violations when open', async () => {
    const { container, unmount } = render(
      <Tooltip open>
        <Tooltip.Trigger>Save</Tooltip.Trigger>
        <Portal>
          <Tooltip.Content withArrow>Save changes</Tooltip.Content>
        </Portal>
      </Tooltip>
    );

    await expectNoA11yViolations(container);

    expect(document.querySelector('[role="tooltip"]')).not.toBeNull();

    unmount();
  });
});
