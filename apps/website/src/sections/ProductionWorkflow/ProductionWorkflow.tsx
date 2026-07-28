'use client';

import { useRef } from 'react';
import {
  ArrowTopButton,
  Bookmark,
  Check,
  File,
  FolderOpen,
  Package,
  Success,
  Upload,
} from '@vellira-ui/icons';
import { Tooltip } from '@vellira-ui/react';
import { motion, useInView, useReducedMotion } from 'motion/react';

import styles from './ProductionWorkflow.module.css';

const workflowSteps = [
  {
    id: 'tokens',
    index: '01',
    Icon: Bookmark,
    label: 'Tokens',
    title: 'Generate outputs',
    description: 'Compile semantic tokens to web and native outputs.',
    meta: '3 themes',
    outputs: ['tokens.css', 'themes.ts'],
  },
  {
    id: 'build',
    index: '02',
    Icon: Package,
    label: 'Build',
    title: 'Compile packages',
    description: 'Build React, Native, icons and assets.',
    meta: '8 packages',
    outputs: ['dist/', 'types/'],
  },
  {
    id: 'quality',
    index: '03',
    Icon: Success,
    label: 'Quality',
    title: 'Validate everything',
    description: 'Run types, tests, accessibility and boundaries.',
    meta: 'All green',
    outputs: ['268 tests', '0 errors'],
  },
  {
    id: 'docs',
    index: '04',
    Icon: File,
    label: 'Docs',
    title: 'Publish references',
    description: 'Sync Storybook, API references and examples.',
    meta: 'Synced',
    outputs: ['Storybook', 'API.md'],
  },
  {
    id: 'release',
    index: '05',
    Icon: Upload,
    label: 'Release',
    title: 'Ship to production',
    description: 'Publish packages through trusted publishing.',
    meta: 'Ready',
    outputs: ['npm', 'GitHub'],
  },
] as const;

const releaseChecklist = [
  'Tokens generated',
  'React build',
  'React Native build',
  'Storybook synced',
  'API docs validated',
] as const;

const footerItems = [
  'Trusted publishing',
  'semantic-release',
  'Type-safe packages',
  'Reproducible builds',
] as const;

const publishTargets = [
  {
    label: 'npm',
    description: 'Install packages',
    href: 'https://www.npmjs.com/package/@vellira-ui/react',
    Icon: Package,
  },
  {
    label: 'GitHub',
    description: 'Browse source',
    href: 'https://github.com/vellira-dev/Vellira',
    Icon: FolderOpen,
  },
  {
    label: 'Storybook',
    description: 'Interactive playground',
    href: 'https://storybook.vellira.dev',
    Icon: Bookmark,
  },
  {
    label: 'Docs',
    description: 'API reference',
    href: 'https://docs.vellira.dev',
    Icon: File,
  },
] as const;

export function ProductionWorkflow() {
  const shouldReduceMotion = useReducedMotion();
  const workflowRef = useRef<HTMLDivElement>(null);
  const isWorkflowInView = useInView(workflowRef, {
    amount: 0.22,
    once: true,
  });

  return (
    <section
      id='workflow'
      className={styles.section}
      aria-labelledby='production-workflow-title'
    >
      <div className={styles.glow} aria-hidden='true' />

      <div className={styles.container}>
        <motion.header
          className={styles.header}
          initial={shouldReduceMotion ? { opacity: 0 } : { opacity: 0, y: 28 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{
            duration: shouldReduceMotion ? 0.2 : 0.75,
            ease: [0.16, 1, 0.3, 1],
          }}
          viewport={{ once: true, amount: 0.5 }}
        >
          <span className={styles.eyebrow}>Production workflow</span>

          <h2 id='production-workflow-title' className={styles.title}>
            From change.
            <span>To production.</span>
          </h2>

          <p className={styles.description}>
            Every token, component and package moves through one validated
            release workflow before it reaches your product.
          </p>
        </motion.header>

        <motion.div
          ref={workflowRef}
          className={`${styles.workflow} ${
            isWorkflowInView ? styles.workflowActive : ''
          }`}
          initial={
            shouldReduceMotion
              ? { opacity: 0 }
              : { opacity: 0, y: 64, scale: 0.97 }
          }
          whileInView={{ opacity: 1, y: 0, scale: 1 }}
          transition={{
            delay: shouldReduceMotion ? 0 : 0.08,
            duration: shouldReduceMotion ? 0.2 : 0.95,
            ease: [0.16, 1, 0.3, 1],
          }}
          viewport={{ once: true, amount: 0.16 }}
        >
          <div className={styles.workflowHeader}>
            <div>
              <span className={styles.panelEyebrow}>Release pipeline</span>
              <h3>Validated from source to registry</h3>
            </div>

            <span className={styles.statusBadge}>
              <span aria-hidden='true' />
              All checks passing
            </span>
          </div>

          <div className={styles.workspace}>
            <div className={styles.pipeline}>
              {workflowSteps.map((step) => {
                const StepIcon = step.Icon;

                return (
                  <article key={step.id} className={styles.step}>
                    <div className={styles.stepTop}>
                      <span className={styles.stepIndex}>{step.index}</span>

                      <span className={styles.stepStatus}>
                        <Check size={12} aria-hidden='true' />
                        {step.meta}
                      </span>
                    </div>

                    <div className={styles.stepIcon} aria-hidden='true'>
                      <StepIcon size={22} />
                    </div>

                    <span className={styles.stepLabel}>{step.label}</span>
                    <h4>{step.title}</h4>
                    <p>{step.description}</p>

                    <div className={styles.stepOutputs}>
                      {step.outputs.map((output) => (
                        <code key={output}>{output}</code>
                      ))}
                    </div>
                  </article>
                );
              })}
            </div>

            <aside className={styles.releasePanel}>
              <div className={styles.releaseHeader}>
                <div>
                  <span className={styles.panelEyebrow}>Release summary</span>
                  <h3>Ready to publish</h3>
                </div>

                <span className={styles.releaseVersion}>v2.18.4</span>
              </div>

              <div className={styles.releaseStats}>
                <div>
                  <span>Packages</span>
                  <strong>8</strong>
                </div>

                <div>
                  <span>Targets</span>
                  <strong>4</strong>
                </div>

                <div>
                  <span>Checks</span>
                  <strong>Passed</strong>
                </div>
              </div>

              <div className={styles.releaseAutomation}>
                <span>semantic-release</span>
                <strong>automated</strong>
              </div>

              <div className={styles.releaseSignal}>
                <span>Trusted Publishing</span>
                <strong>enabled</strong>
              </div>

              <div className={styles.releaseChecklist}>
                {releaseChecklist.map((item) => (
                  <div key={item}>
                    <span>{item}</span>
                    <strong>
                      <Check size={14} aria-label='Passed' />
                    </strong>
                  </div>
                ))}
              </div>

              <div className={styles.publishTargets}>
                <span>Publish targets</span>

                <div>
                  {publishTargets.map((target) => {
                    const TargetIcon = target.Icon;

                    return (
                      <Tooltip
                        key={target.label}
                        placement='top'
                        delay={180}
                        portal={false}
                      >
                        <Tooltip.Trigger asChild>
                          <a
                            href={target.href}
                            target='_blank'
                            rel='noreferrer'
                            className={styles.publishLink}
                            aria-label={`${target.label}: ${target.description}`}
                          >
                            <TargetIcon size={13} aria-hidden='true' />
                            <span>{target.label}</span>
                            <ArrowTopButton
                              size={12}
                              aria-hidden='true'
                              className={styles.publishArrow}
                            />
                          </a>
                        </Tooltip.Trigger>

                        <Tooltip.Content
                          withArrow={false}
                          className={styles.publishTooltip}
                        >
                          <strong>{target.label}</strong>
                          <span>{target.description}</span>
                        </Tooltip.Content>
                      </Tooltip>
                    );
                  })}
                </div>
              </div>
            </aside>
          </div>

          <footer className={styles.footer}>
            {footerItems.map((item) => (
              <span key={item}>
                <Check size={13} aria-hidden='true' />
                {item}
              </span>
            ))}
          </footer>
        </motion.div>
      </div>
    </section>
  );
}

ProductionWorkflow.displayName = 'ProductionWorkflow';
