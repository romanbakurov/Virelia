import { SiteHeader } from '@/components/SiteHeader';
import { Hero } from '@/sections/Hero';

export default function HomePage() {
  return (
    <>
      <SiteHeader />

      <main>
        <Hero />

        <section id='components' aria-label='Components' />
        <section id='themes' aria-label='Themes' />
        <section id='pro' aria-label='Vellira Pro' />
      </main>
    </>
  );
}
