import { getComponentExpansionReport } from '../../packages/metadata/src/expansionReport';

process.stdout.write(
  `${JSON.stringify(getComponentExpansionReport(), null, 2)}\n`
);
