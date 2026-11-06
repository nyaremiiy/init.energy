import { Hero } from "@/components/sections/home/hero";
import { ProductLine } from "@/components/sections/home/product-line";
import { SolutionsBySegment } from "@/components/sections/home/solutions-by-segment";

export default function Home() {
  return (
    <main>
      <Hero />
      <SolutionsBySegment />
      <ProductLine />
    </main>
  );
}
