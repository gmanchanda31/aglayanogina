import { FeaturedProject } from "@/components/home/featured-project";
import { HomeHero } from "@/components/home/home-hero";
import { JournalPair } from "@/components/home/journal-pair";
import { PracticeRibbon } from "@/components/home/practice-ribbon";
import { SelectedWorks } from "@/components/home/selected-works";
import { StatementBlock } from "@/components/home/statement-block";
import { StudioSupport } from "@/components/home/studio-support";

export default function HomePage() {
  return (
    <>
      <HomeHero />
      <PracticeRibbon />
      <StatementBlock />
      <FeaturedProject />
      <SelectedWorks />
      <JournalPair />
      <StudioSupport />
    </>
  );
}
