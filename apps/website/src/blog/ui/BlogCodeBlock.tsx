import { isValidElement } from 'react';
import type { HTMLAttributes, ReactNode } from 'react';

import { codeToHtml } from 'shiki';

import styles from './BlogCodeBlock.module.css';

interface CodeElementProps extends HTMLAttributes<HTMLElement> {
  children?: ReactNode;
}

interface BlogCodeBlockProps extends HTMLAttributes<HTMLPreElement> {
  children?: ReactNode;
}

function readCodeBlock(children: ReactNode) {
  if (!isValidElement<CodeElementProps>(children)) {
    return null;
  }

  const code = children.props.children;

  if (typeof code !== 'string') {
    return null;
  }

  const languageMatch = /language-([\w-]+)/.exec(
    children.props.className ?? ''
  );

  return {
    code: code.replace(/\n$/, ''),
    language: languageMatch?.[1] ?? 'text',
  };
}

export async function BlogCodeBlock({
  children,
  ...props
}: BlogCodeBlockProps) {
  const codeBlock = readCodeBlock(children);

  if (!codeBlock) {
    return <pre {...props}>{children}</pre>;
  }

  try {
    const highlightedHtml = await codeToHtml(codeBlock.code, {
      lang: codeBlock.language,
      themes: {
        light: 'github-light',
        dark: 'github-dark',
        highContrast: 'github-dark-high-contrast',
      },
      defaultColor: false,
    });

    return (
      <div className={styles.codeBlock} data-language={codeBlock.language}>
        <div className={styles.codeBlockToolbar} aria-hidden='true'>
          <span>{codeBlock.language}</span>
        </div>
        <div dangerouslySetInnerHTML={{ __html: highlightedHtml }} />
      </div>
    );
  } catch {
    return <pre {...props}>{children}</pre>;
  }
}
