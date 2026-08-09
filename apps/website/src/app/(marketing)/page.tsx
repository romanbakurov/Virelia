import { BackToTop } from '@/components/navigation/BackToTop';
import { CodeShowcase } from '@/sections/home/CodeShowcase';
import { ComponentShowcase } from '@/sections/home/ComponentShowcase';
import { FinalCta } from '@/sections/home/FinalCta';
import { Hero } from '@/sections/home/Hero';
import { PlatformParity } from '@/sections/home/PlatformParity';
import { Pro } from '@/sections/home/Pro';
import { ProductInterfaceDemo } from '@/sections/home/ProductInterfaceDemo';
import { ProductionWorkflow } from '@/sections/home/ProductionWorkflow';
import { QuickStart } from '@/sections/home/QuickStart';
import { Roadmap } from '@/sections/home/Roadmap';
import { SocialProof } from '@/sections/home/SocialProof';
import { ThemeStudio } from '@/sections/home/ThemeStudio';

export default function HomePage() {
  return (
    <>
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

      <BackToTop />
    </>
  );
}
