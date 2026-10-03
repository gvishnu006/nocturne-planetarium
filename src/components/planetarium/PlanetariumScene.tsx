"use client";

import { useEffect, useRef, useState } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { Suspense } from "react";
import { useScroll, useTransform } from "framer-motion";
import { StarField } from "./StarField";
import { SkyGradient } from "./SkyGradient";
import { MilkyWay } from "./MilkyWay";
import { Constellations } from "./Constellations";
import type { StarCatalog } from "@/lib/catalog";
import type { Constellation, SkyConfig } from "@/types/astro";
import { useSkyStore } from "@/lib/skyStore";
import { StarLabels } from "./StarLabels";

function SkyRotationSync({ scrollPhase }: { scrollPhase: number }) {
  const { setGmst } = useSkyStore();
  const last = useRef(0);

  useEffect(() => {
    setGmst(scrollPhase * 24);
    last.current = scrollPhase;
  }, [scrollPhase, setGmst]);

  useFrame(() => {
    // drive via store; no-op here
  });

  return null;
}

export function PlanetariumScene({ catalog, constellations, sky }: { catalog: StarCatalog; constellations: Constellation[]; sky: SkyConfig }) {
  const container = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: container, offset: ["start start", "end end"] });
  const rotation = useTransform(scrollYProgress, [0, 1], [0, 24]); // 24h sidereal over full scroll
  const [phase, setPhase] = useState(0);

  useEffect(() => {
    const unsub = rotation.on("change", (v) => setPhase(v));
    return () => unsub();
  }, [rotation]);

  useEffect(() => {
    const el = container.current;
    if (!el) return;
    const onWheel = (e: WheelEvent) => {
      e.preventDefault();
      window.scrollBy({ top: e.deltaY * 0.8, behavior: "auto" });
    };
    el.addEventListener("wheel", onWheel, { passive: false });
    return () => el.removeEventListener("wheel", onWheel);
  }, []);

  return (
    <div ref={container} className="relative h-[400vh] w-full bg-[#03040a]">
      <div style={{ position: "fixed", inset: 0, zIndex: 0 }}>
        <Canvas camera={{ position: [0, 0, 42], fov: 65 }} dpr={[1, 1.5]} gl={{ antialias: false, powerPreference: "high-performance" }}>
          <color attach="background" args={[sky.bg.top]} />
          <Suspense fallback={null}>
            <SkyGradient top={sky.bg.top} bottom={sky.bg.bottom} />
            <MilkyWay strength={sky.milkyWay.strength} color={sky.milkyWay.color} />
            <StarField catalog={catalog} />
            <Constellations constellations={constellations} />
            <StarLabels />
          </Suspense>
          <SkyRotationSync scrollPhase={phase} />
        </Canvas>
      </div>
      <div className="relative z-10 pointer-events-none">
        <section className="h-screen flex items-center justify-center px-6">
          <div className="max-w-4xl text-center text-neutral-200">
            <h1 className="text-5xl md:text-7xl font-light tracking-[0.4em] uppercase">Nocturne Planetarium</h1>
            <p className="mt-6 text-sm md:text-base tracking-[0.25em] uppercase opacity-70">Real sky. Accurate distribution. Time passes with the scroll.</p>
            <p className="mt-4 text-xs tracking-[0.18em] uppercase opacity-50">Scroll to turn the firmament</p>
          </div>
        </section>
        <section className="h-screen flex items-center justify-center px-6">
          <div className="max-w-2xl text-center text-neutral-200">
            <h2 className="text-2xl md:text-4xl font-light tracking-[0.3em] uppercase">Sidereal motion</h2>
            <p className="mt-4 text-sm tracking-[0.18em] uppercase opacity-70">8,920 stars down to magnitude 6.5</p>
          </div>
        </section>
        <section className="h-screen flex items-center justify-center px-6">
          <div className="max-w-2xl text-center text-neutral-200">
            <h2 className="text-2xl md:text-4xl font-light tracking-[0.3em] uppercase">Horizon physics</h2>
            <p className="mt-4 text-sm tracking-[0.18em] uppercase opacity-70">Extinction, reddening and scintillation</p>
          </div>
        </section>
        <section className="h-screen flex items-center justify-center px-6">
          <div className="max-w-2xl text-center text-neutral-200">
            <h2 className="text-2xl md:text-4xl font-light tracking-[0.3em] uppercase">Constellations</h2>
            <p className="mt-4 text-sm tracking-[0.18em] uppercase opacity-70">Minimal, humanly legible</p>
          </div>
        </section>
      </div>
    </div>
  );
}