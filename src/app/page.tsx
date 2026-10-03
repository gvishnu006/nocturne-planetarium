import { loadCatalog } from "@/lib/catalog";
import { constellations } from "@/lib/constellations";
import skyData from "../../public/data/sky.json";
import { PlanetariumScene } from "@/components/planetarium/PlanetariumScene";
import type { SkyConfig } from "@/types/astro";
import fs from "fs";
import path from "path";

export default async function Home() {
  const buf = fs.readFileSync(path.join(process.cwd(), "public/data/stars.bin"));
  const catalog = loadCatalog(buf.buffer.slice(buf.byteOffset, buf.byteOffset + buf.byteLength));
  return (
    <main className="min-h-screen">
      <PlanetariumScene catalog={catalog} constellations={constellations as any} sky={skyData as SkyConfig} />
    </main>
  );
}
