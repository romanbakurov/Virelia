import { SiteHeader } from '@/components/SiteHeader';
import { BackToTop } from '@/components/BackToTop';
import { Hero } from '@/sections/Hero';
import { PlatformParity } from '@/sections/PlatformParity';
import { CodeShowcase } from '@/sections/CodeShowcase';
import { ComponentShowcase } from '@/sections/ComponentShowcase';
import { ProductInterfaceDemo } from '@/sections/ProductInterfaceDemo';
import { ThemeStudio } from '@/sections/ThemeStudio';
import { ProductionWorkflow } from '@/sections/ProductionWorkflow';
import { QuickStart } from '@/sections/QuickStart';
import { SocialProof } from '@/sections/SocialProof';
import { Pro } from '@/sections/Pro';
import { Roadmap } from '@/sections/Roadmap';
import { FinalCta } from '@/sections/FinalCta';
import { SiteFooter } from '@/sections/SiteFooter';

export default function HomePage() {
  return (
    <>
      <SiteHeader />

      <main>
        <Hero />
        <ComponentShowcase />
        <ThemeStudio />
        <PlatformParity />
        <ProductInterfaceDemo />
        <CodeShowcase />
        <ProductionWorkflow />
        <QuickStart />
        <SocialProof />
        <Roadmap />
        <Pro />
        <FinalCta />
        <SiteFooter />
      </main>

      <BackToTop />
    </>
  );
}
