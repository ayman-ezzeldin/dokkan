import Hero from "@/components/Hero";
import SuggestedProducts from "@/components/SuggestedProducts";

export default async function Home() {
  return (
    <div className="min-h-screen">
      <Hero />
      <SuggestedProducts />
    </div>
  );
}
