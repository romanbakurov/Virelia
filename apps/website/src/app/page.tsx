import { SiteHeader } from '@/components/SiteHeader';
import { Hero } from '@/sections/Hero';
import { PlatformParity } from '@/sections/PlatformParity';

export default function HomePage() {
  return (
    <>
      <SiteHeader />

      <main>
        <Hero />
        <PlatformParity />

        <section id='components' aria-label='Components' />
        <section id='themes' aria-label='Themes' />
        <section id='pro' aria-label='Vellira Pro' />
      </main>
    </>
  );
}
