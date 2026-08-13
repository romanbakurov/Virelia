import { createHighlighter } from 'shiki';

export const highlighter = createHighlighter({
  themes: ['github-light', 'github-dark'],
  langs: ['tsx'],
});
