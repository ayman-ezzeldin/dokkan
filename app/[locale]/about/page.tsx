import AboutHero from "@/components/about/AboutHero";
import MissionStatement from "@/components/about/MissionStatement";
import OurStory from "@/components/about/OurStory";
import ValuesGrid from "@/components/about/ValuesGrid";
import Statistics from "@/components/about/Statistics";
import WhyChooseUs from "@/components/about/WhyChooseUs";
import CTASection from "@/components/about/CTASection";

export default async function AboutPage() {
  return (
    <div className="min-h-screen">
      <AboutHero />
      <MissionStatement />
      <OurStory />
      <ValuesGrid />
      <Statistics />
      <WhyChooseUs />
      <CTASection />
    </div>
  );
}


