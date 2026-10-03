import starsData from "../../public/data/stars.json";
import constData from "../../public/data/constellations.json";
import skyData from "../../public/data/sky.json";
import { PlanetariumScene } from "@/components/planetarium/PlanetariumScene";
import type { Star, Constellation, SkyConfig } from "@/types/astro";
import Link from "next/link";

export default function Home() {
  const stars = starsData as Star[];
  const constellations = constData as Constellation[];
  const sky = skyData as SkyConfig;

  return (
    <main className="min-h-screen">
      <nav className="fixed top-0 left-0 right-0 z-20 flex items-center justify-between px-6 py-4 backdrop-blur-[1px] bg-black/10 border-b border-white/5">
        <Link href="/" className="tracking-[0.3em] text-xs uppercase text-neutral-200">
          Nocturne
        </Link>
        <div className="flex gap-6">
          <Link href="/events" className="tracking-[0.2em] text-[10px] uppercase text-neutral-300/80 hover:text-neutral-100 transition-colors">Events</Link>
          <Link href="/visit" className="tracking-[0.2em] text-[10px] uppercase text-neutral-300/80 hover:text-neutral-100 transition-colors">Visit</Link>
          <Link href="/about" className="tracking-[0.2em] text-[10px] uppercase text-neutral-300/80 hover:text-neutral-100 transition-colors">About</Link>
        </div>
      </nav>
      <PlanetariumScene stars={stars} constellations={constellations} sky={sky} />
      <footer className="fixed bottom-0 left-0 right-0 z-20 px-6 py-3 text-center text-[10px] tracking-[0.15em] uppercase text-neutral-400/70 border-t border-white/5 backdrop-blur-[1px] bg-black/10">
        Astronomy-inspired design • Deep indigo sky • Realistic star density
      </footer>
    </main>
  );
}
