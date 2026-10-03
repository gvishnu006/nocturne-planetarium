import { loadCatalog } from "@/lib/catalog";
import { constellations } from "@/lib/constellations";
import skyData from "../../public/data/sky.json";
import { PlanetariumScene } from "@/components/planetarium/PlanetariumScene";
import type { SkyConfig } from "@/types/astro";

export default async function Home() {
  const buf = await fetch("/data/stars.bin").then((r) => r.arrayBuffer());
  const catalog = loadCatalog(buf);

  return (
    <main className="min-h-screen">
      <PlanetariumScene catalog={catalog} constellations={constellations as any} sky={skyData as SkyConfig} />
    </main>
  );
}