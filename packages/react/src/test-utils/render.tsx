import { act } from 'react';
import { createRoot } from 'react-dom/client';

import type { ReactNode } from 'react';

export function render(ui: ReactNode, host: HTMLElement = document.body) {
  const container = document.createElement('div');
  host.append(container);
  const root = createRoot(container);

  act(() => root.render(ui));

  return {
    container,
    rerender(nextUi: ReactNode) {
      act(() => root.render(nextUi));
    },
    unmount() {
      act(() => root.unmount());
      container.remove();
    },
  };
}
