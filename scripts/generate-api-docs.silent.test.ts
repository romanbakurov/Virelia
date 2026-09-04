import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';

import { afterEach, describe, expect, it, vi } from 'vitest';

import { generateApiDocs, section } from './generate-api-docs';

const roots: string[] = [];

afterEach(() => {
  vi.restoreAllMocks();

  for (const root of roots.splice(0)) {
    fs.rmSync(root, {
      recursive: true,
      force: true,
    });
  }
});

describe('generateApiDocs silent library mode', () => {
  it('updates docs without writing informational output to stdout or stderr', async () => {
    const root = fs.mkdtempSync(
      path.join(os.tmpdir(), 'vellira-api-docs-silent-')
    );

    roots.push(root);

    const typesFile = path.join(root, 'packages/react/src/Test/types.ts');
    const apiFile = path.join(root, 'packages/react/API.md');

    fs.mkdirSync(path.dirname(typesFile), {
      recursive: true,
    });

    fs.writeFileSync(
      typesFile,
      `export interface TestProps {
  value?: string;
}
`
    );

    fs.writeFileSync(
      apiFile,
      `# React API

## Test

<!-- api-docgen:start web.TestProps.Test -->
| Prop | Type | Required | Description |
| ---- | ---- | -------- | ----------- |
| \`value\` | \`number\` | No | Old description |
<!-- api-docgen:end web.TestProps.Test -->
`
    );

    const log = vi.spyOn(console, 'log').mockImplementation(() => undefined);

    const error = vi
      .spyOn(console, 'error')
      .mockImplementation(() => undefined);

    const result = await generateApiDocs({
      rootDir: root,
      silent: true,
      sections: [section('web', '## Test', 'TestProps', 'src/Test/types.ts')],
    });

    expect(result.status).toBe('updated');
    expect(result.changedFiles).toEqual(['packages/react/API.md']);

    expect(log).not.toHaveBeenCalled();
    expect(error).not.toHaveBeenCalled();

    expect(fs.readFileSync(apiFile, 'utf8')).toContain('`value`');
  });
});

it('preserves informational output by default', async () => {
  const root = fs.mkdtempSync(
    path.join(os.tmpdir(), 'vellira-api-docs-default-output-')
  );

  roots.push(root);

  const typesFile = path.join(root, 'packages/react/src/Test/types.ts');
  const apiFile = path.join(root, 'packages/react/API.md');

  fs.mkdirSync(path.dirname(typesFile), {
    recursive: true,
  });

  fs.writeFileSync(
    typesFile,
    `export interface TestProps {
  value?: string;
}
`
  );

  fs.writeFileSync(
    apiFile,
    `# React API

## Test

<!-- api-docgen:start web.TestProps.Test -->
| Prop | Type | Required | Description |
| ---- | ---- | -------- | ----------- |
| \`value\` | \`number\` | No | Old description |
<!-- api-docgen:end web.TestProps.Test -->
`
  );

  const log = vi.spyOn(console, 'log').mockImplementation(() => undefined);

  await generateApiDocs({
    rootDir: root,
    sections: [section('web', '## Test', 'TestProps', 'src/Test/types.ts')],
  });

  expect(log).toHaveBeenCalledWith('Updated packages/react/API.md');
});

it('documents props from every branch of a discriminated union type', async () => {
  const root = fs.mkdtempSync(
    path.join(os.tmpdir(), 'vellira-api-docs-union-')
  );

  roots.push(root);

  const typesFile = path.join(root, 'packages/react/src/Test/types.ts');
  const apiFile = path.join(root, 'packages/react/API.md');

  fs.mkdirSync(path.dirname(typesFile), {
    recursive: true,
  });

  fs.writeFileSync(
    typesFile,
    `export type TestProps =
  | {
      children?: string;
      type?: 'single';
      value?: string;
      onValueChange?: (value: string) => void;
      collapsible?: boolean;
    }
  | {
      children?: string;
      type: 'multiple';
      value?: string[];
      onValueChange?: (value: string[]) => void;
      collapsible?: never;
    };
`
  );

  fs.writeFileSync(
    apiFile,
    `# React API

## Test

<!-- api-docgen:start web.TestProps.Test -->
| Prop | Type | Required | Description |
| ---- | ---- | -------- | ----------- |
| \`children\` | \`string\` | No | Content |
<!-- api-docgen:end web.TestProps.Test -->
`
  );

  await generateApiDocs({
    rootDir: root,
    silent: true,
    sections: [section('web', '## Test', 'TestProps', 'src/Test/types.ts')],
  });

  const result = fs.readFileSync(apiFile, 'utf8');

  expect(result).toContain("`'single' \\| 'multiple'`");
  expect(result).toContain('`string \\| string[]`');
  expect(result).toContain(
    '`(value: string) => void \\| (value: string[]) => void`'
  );
  expect(result).toContain('`collapsible`');
});
