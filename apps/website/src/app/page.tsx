import { SiteHeader } from '@/components/SiteHeader';
import { Hero } from '@/sections/Hero';
import { PlatformParity } from '@/sections/PlatformParity';
import { CodeShowcase } from '@/sections/CodeShowcase';
import { ComponentShowcase } from '@/sections/ComponentShowcase';
import { ProductInterfaceDemo } from '@/sections/ProductInterfaceDemo';

export default function HomePage() {
  return (
    <>
      <SiteHeader />

      <main>
        <Hero />
        <PlatformParity />
        <ComponentShowcase />
        <ProductInterfaceDemo />
        <CodeShowcase />

        <section id='themes' aria-label='Themes' />
        <section id='pro' aria-label='Vellira Pro' />
      </main>
    </>
  );
}
