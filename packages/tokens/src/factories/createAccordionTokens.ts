export type AccordionTriggerState = {
  bg: string;
  fg: string;
};

export type AccordionTokensConfig = {
  root: {
    bg: string;
    border: string;
  };
  divider: string;
  trigger: {
    default: AccordionTriggerState;
    hover: AccordionTriggerState;
    pressed: AccordionTriggerState;
    disabled: AccordionTriggerState;
  };
  indicator: string;
  content: {
    bg: string;
    fg: string;
  };
  focusRing: string;
};

export const createAccordionTokens = (config: AccordionTokensConfig) => config;
