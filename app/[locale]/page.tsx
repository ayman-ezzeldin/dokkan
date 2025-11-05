import Hero from "@/components/Hero";
import SuggestedProducts from "@/components/SuggestedProducts";
import Testimonials from "@/components/Testimonials";
import FAQ from "@/components/FAQ";

export default async function Home() {
  return (
    <div className="min-h-screen">
      <Hero />
      <SuggestedProducts />
      <Testimonials />
      <FAQ />
    </div>
  );
}
