from pathlib import Path


def read(path: str) -> str:
    return Path(path).read_text()


def write(path: str, content: str) -> None:
    Path(path).write_text(content)


def replace_once(content: str, old: str, new: str, label: str) -> str:
    count = content.count(old)
    if count != 1:
        raise SystemExit(f"{label}: expected one anchor, found {count}")
    return content.replace(old, new, 1)


checker_path = "scripts/checks/component-completeness/check-component.ts"
checker = read(checker_path)

helper = r'''
const MAX_LOCAL_TYPE_MODULES = 64;

function isInsideComponentRoot(componentDir: string, candidate: string): boolean {
  const relative = path.relative(componentDir, candidate);

  return (
    relative === '' ||
    (!relative.startsWith(`..${path.sep}`) &&
      relative !== '..' &&
      !path.isAbsolute(relative))
  );
}

function resolveLocalTypeModule(params: {
  currentFile: string;
  componentDir: string;
  specifier: string;
}): string[] {
  const { currentFile, componentDir, specifier } = params;
  const unresolved = path.resolve(path.dirname(currentFile), specifier);
  const candidates = path.extname(unresolved)
    ? [unresolved]
    : [
        `${unresolved}.ts`,
        `${unresolved}.tsx`,
        path.join(unresolved, 'index.ts'),
        path.join(unresolved, 'index.tsx'),
      ];

  return candidates.filter(
    (candidate) =>
      isInsideComponentRoot(componentDir, candidate) && fs.existsSync(candidate)
  );
}

function rendererTypesDeriveFromSharedAuthority(params: {
  entryFile: string;
  componentDir: string;
}): boolean {
  const { entryFile, componentDir } = params;
  const pending = [entryFile];
  const visited = new Set<string>();

  while (pending.length > 0 && visited.size < MAX_LOCAL_TYPE_MODULES) {
    const currentFile = pending.shift();

    if (!currentFile || visited.has(currentFile)) {
      continue;
    }

    visited.add(currentFile);

    const source = fs.readFileSync(currentFile, 'utf8');

    if (
      source.includes("from '@vellira-ui/types'") ||
      source.includes('from "@vellira-ui/types"')
    ) {
      return true;
    }

    const specifiers = new Set<string>();
    const typeFromPattern =
      /\b(?:import|export)\s+type\b[\s\S]*?\bfrom\s+['"](\.[^'"]+)['"]/g;
    const exportAllPattern = /\bexport\s+\*\s+from\s+['"](\.[^'"]+)['"]/g;

    for (const pattern of [typeFromPattern, exportAllPattern]) {
      for (const match of source.matchAll(pattern)) {
        const specifier = match[1];

        if (specifier) {
          specifiers.add(specifier);
        }
      }
    }

    const nextFiles = [...specifiers]
      .flatMap((specifier) =>
        resolveLocalTypeModule({
          currentFile,
          componentDir,
          specifier,
        })
      )
      .filter((candidate) => !visited.has(candidate))
      .sort();

    pending.push(...nextFiles);
  }

  return false;
}
'''

checker = replace_once(
    checker,
    "\nfunction checkTypeOwnership(params: {",
    f"\n{helper}\nfunction checkTypeOwnership(params: {{",
    "type ownership traversal helper",
)

old = r'''    const source = fs.readFileSync(localTypesFile, 'utf8');

    if (
      !source.includes("from '@vellira-ui/types'") &&
      !source.includes('from "@vellira-ui/types"')
    ) {
      errors.push(
        `Renderer types must derive shared semantics from @vellira-ui/types: ${localTypesFile}`
      );
    }
'''
new = r'''    if (
      !rendererTypesDeriveFromSharedAuthority({
        entryFile: localTypesFile,
        componentDir: target.componentDir,
      })
    ) {
      errors.push(
        `Renderer types must derive shared semantics from @vellira-ui/types through the local type graph: ${localTypesFile}`
      );
    }
'''
checker = replace_once(checker, old, new, "shallow type ownership proof")
write(checker_path, checker)


test_path = "scripts/checks/component-completeness/check-component.test.ts"
test = read(test_path)

old_fixture = r'''      fs.writeFileSync(
        path.join(componentDir, 'types.ts'),
        "import type { BaseDisclosureProps } from '@vellira-ui/types';\nexport type DisclosureProps = BaseDisclosureProps;\n"
      );
'''
new_fixture = r'''      const rootDir = path.join(componentDir, 'Root');
      fs.mkdirSync(rootDir, { recursive: true });
      fs.writeFileSync(
        path.join(componentDir, 'types.ts'),
        "export type { DisclosureProps } from './Root';\n"
      );
      fs.writeFileSync(
        path.join(rootDir, 'index.ts'),
        "export type { DisclosureProps } from './types';\n"
      );
      fs.writeFileSync(
        path.join(rootDir, 'types.ts'),
        "import type { BaseDisclosureProps } from '@vellira-ui/types';\nexport type DisclosureProps = BaseDisclosureProps;\n"
      );
'''
test = replace_once(
    test,
    old_fixture,
    new_fixture,
    "transitive shared ownership fixture",
)
write(test_path, test)
