"use client";

import { useSkyStore } from "@/lib/skyStore";
import { useEffect } from "react";
import { gmstHours } from "@/lib/astro";

export function SkyControls() {
  const { playing, setPlaying, setGmst, rate, setRate, twinkle, setTwinkle, exposure, setExposure, labels, toggleLabels, lines, toggleLines } = useSkyStore();

  useEffect(() => {
    if (!playing) return;
    const id = setInterval(() => {
      const now = new Date();
      const gmst = gmstHours(now);
      setGmst(gmst);
    }, 500);
    return () => clearInterval(id);
  }, [playing, setGmst]);

  return (
    <div className="fixed bottom-4 left-1/2 z-20 -translate-x-1/2">
      <div className="flex flex-wrap items-center justify-center gap-3 rounded-sm border border-white/10 bg-black/40 px-4 py-2 text-[10px] uppercase tracking-[0.18em] text-neutral-300 backdrop-blur-md shadow-[0_0_120px_-60px_rgba(120,150,220,0.8)]">
        <button onClick={() => setPlaying(!playing)} className="hover:text-neutral-100 transition-colors">
          {playing ? "Pause" : "Play"}
        </button>
        <span className="text-neutral-600">|</span>
        <div className="flex items-center gap-2">
          <span>Rate</span>
          <input
            type="range"
            min="0"
            max="10"
            step="0.5"
            value={rate}
            onChange={(e) => setRate(parseFloat(e.target.value))}
            className="h-1 w-20 accent-neutral-300"
          />
          <span className="tabular-nums">{rate.toFixed(1)}x</span>
        </div>
        <span className="text-neutral-600">|</span>
        <div className="flex items-center gap-2">
          <span>Twinkle</span>
          <input
            type="range"
            min="0"
            max="1"
            step="0.1"
            value={twinkle}
            onChange={(e) => setTwinkle(parseFloat(e.target.value))}
            className="h-1 w-16 accent-neutral-300"
          />
        </div>
        <span className="text-neutral-600">|</span>
        <div className="flex items-center gap-2">
          <span>Exposure</span>
          <input
            type="range"
            min="0.4"
            max="2"
            step="0.1"
            value={exposure}
            onChange={(e) => setExposure(parseFloat(e.target.value))}
            className="h-1 w-16 accent-neutral-300"
          />
        </div>
        <span className="text-neutral-600">|</span>
        <button onClick={toggleLabels} className="hover:text-neutral-100 transition-colors">
          Labels {labels ? "On" : "Off"}
        </button>
        <button onClick={toggleLines} className="hover:text-neutral-100 transition-colors">
          Lines {lines ? "On" : "Off"}
        </button>
      </div>
    </div>
  );
}
