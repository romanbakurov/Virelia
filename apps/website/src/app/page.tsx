import { SiteHeader } from '@/components/SiteHeader';
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

export default function HomePage() {
  return (
    <>
      <SiteHeader />

      <main>
        <Hero />
        <ComponentShowcase />
        <PlatformParity />
        <ThemeStudio />
        <ProductInterfaceDemo />
        <CodeShowcase />
        <ProductionWorkflow />
        <QuickStart />
        <SocialProof />
        <Pro />
      </main>
    </>
  );
}
