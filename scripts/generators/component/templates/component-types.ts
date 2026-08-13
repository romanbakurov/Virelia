export type ComponentTemplateParams = {
  componentName: string;
};

export function renderTypesTemplate({
  componentName,
}: ComponentTemplateParams) {
  return `export type ${componentName}Props = {
  disabled?: boolean;
};
`;
}
