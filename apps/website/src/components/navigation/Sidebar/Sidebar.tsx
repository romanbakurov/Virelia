import type { ReactNode } from 'react';

import styles from './Sidebar.module.css';

interface SidebarProps {
  children: ReactNode;
  ariaLabel: string;
  className?: string;
}

interface SidebarGroupProps {
  label: string;
  children: ReactNode;
}

interface SidebarItemProps {
  children: ReactNode;
  active?: boolean;
}

export function Sidebar({ children, ariaLabel, className }: SidebarProps) {
  return (
    <aside
      className={[styles.sidebar, className].filter(Boolean).join(' ')}
      aria-label={ariaLabel}
    >
      <div className={styles.inner}>{children}</div>
    </aside>
  );
}

export function SidebarGroup({ label, children }: SidebarGroupProps) {
  return (
    <section className={styles.group}>
      <h2 className={styles.groupLabel}>{label}</h2>

      <nav className={styles.navigation}>{children}</nav>
    </section>
  );
}

export function SidebarItem({ children, active = false }: SidebarItemProps) {
  return (
    <div
      className={[styles.item, active ? styles.activeItem : null]
        .filter(Boolean)
        .join(' ')}
    >
      {children}
    </div>
  );
}
