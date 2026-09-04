import { switchDocs } from './Switch.docs';
import { accordionDocs } from './Accordion.docs';

export const componentDocsContracts = [switchDocs, accordionDocs] as const;

export { switchDocs };
export * from './defineComponentDocs';
export * from './navigation';
export * from './types';
export * from './validateComponentDocs';
