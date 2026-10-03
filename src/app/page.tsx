import { loadCatalog } from "@/lib/catalog";
import { constellations } from "@/lib/constellations";
import skyData from "../../public/data/sky.json";
import { PlanetariumScene } from "@/components/planetarium/PlanetariumScene";
import type { SkyConfig } from "@/types/astro";
import starsBin from "../../public/data/stars.bin";

export default async function Home() {
  const catalog = loadCatalog(starsBin as ArrayBuffer);
  return (
    <main className="min-h-screen">
      <PlanetariumScene catalog={catalog} constellations={constellations as any} sky={skyData as SkyConfig} />
    </main>
  );
}
