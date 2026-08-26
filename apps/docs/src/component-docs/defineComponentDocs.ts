import type { ComponentDocsContract } from './types';

export function defineComponentDocs<
  const Contract extends ComponentDocsContract,
>(contract: Contract): Contract {
  return contract;
}
