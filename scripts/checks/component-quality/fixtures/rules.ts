import type { ComponentQualityRule } from '../types';

export const passRule: ComponentQualityRule = {
  definition: {
    id: 'fixture.pass',
    dimension: 'implementation-completeness',
    severity: 'required',
    evaluation: 'automated',
    description: 'Fixture passing rule.',
  },
  evaluate: ({ platform }) => ({
    ruleId: 'fixture.pass',
    dimension: 'implementation-completeness',
    severity: 'required',
    evaluation: 'automated',
    status: 'pass',
    platform,
  }),
};

export const warnRule: ComponentQualityRule = {
  definition: {
    id: 'fixture.warn',
    dimension: 'documentation',
    severity: 'recommended',
    evaluation: 'automated',
    description: 'Fixture warning rule.',
  },
  evaluate: ({ platform }) => ({
    ruleId: 'fixture.warn',
    dimension: 'documentation',
    severity: 'recommended',
    evaluation: 'automated',
    status: 'warn',
    platform,
    message: 'Fixture warning.',
  }),
};

export const failRule: ComponentQualityRule = {
  definition: {
    id: 'fixture.fail',
    dimension: 'behavior',
    severity: 'required',
    evaluation: 'automated',
    description: 'Fixture failing rule.',
  },
  evaluate: ({ platform }) => ({
    ruleId: 'fixture.fail',
    dimension: 'behavior',
    severity: 'required',
    evaluation: 'automated',
    status: 'fail',
    platform,
    message: 'Fixture failure.',
  }),
};

export const notApplicableRule: ComponentQualityRule = {
  definition: {
    id: 'fixture.not-applicable',
    dimension: 'platform-quality',
    severity: 'required',
    evaluation: 'automated',
    description: 'Fixture not-applicable rule.',
  },
  evaluate: ({ platform }) => ({
    ruleId: 'fixture.not-applicable',
    dimension: 'platform-quality',
    severity: 'required',
    evaluation: 'automated',
    status: 'not-applicable',
    platform,
  }),
};
