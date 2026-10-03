"use client";

import { create } from "zustand";
import { gmstHours } from "./astro";

/**
 * Sky state.
 *
 * `gmst` is stored rather than a wall-clock Date so that the time scrubber can
 * drive the sky backwards without fighting the browser clock. `playing` means
 * "run at real time", which is how the sky behaves on its own.
 */
type SkyState = {
  /** Sidereal time in hours. */
  gmst: number;
  /** True when gmst is being advanced from the system clock. */
  playing: boolean;
  /** Multiplier on real time while playing. 1 = real time, 0 = frozen. */
  rate: number;
  latDeg: number;
  lonDeg: number;
  /** 0 disables scintillation, for reduced-motion and for stills. */
  twinkle: number;
  exposure: number;
  labels: boolean;
  lines: boolean;
  grid: boolean;
  /** Scroll progress, 0..1, drives the sidereal turn. */
  scrollPhase: number;

  setGmst: (h: number) => void;
  setPlaying: (p: boolean) => void;
  setRate: (r: number) => void;
  setObserver: (lat: number, lon: number) => void;
  setTwinkle: (t: number) => void;
  setExposure: (e: number) => void;
  toggleLabels: () => void;
  toggleLines: () => void;
  toggleGrid: () => void;
  setScrollPhase: (p: number) => void;
};

export const useSkyStore = create<SkyState>((set) => ({
  gmst: gmstHours(new Date()),
  playing: true,
  rate: 1,
  latDeg: 40.7128, // New York
  lonDeg: -74.006,
  twinkle: 1,
  exposure: 1,
  labels: true,
  lines: true,
  grid: false,
  scrollPhase: 0,

  setGmst: (h) => set({ gmst: ((h % 24) + 24) % 24, playing: false }),
  setPlaying: (p) => set({ playing: p }),
  setRate: (r) => set({ rate: r }),
  setObserver: (latDeg, lonDeg) => set({ latDeg, lonDeg }),
  setTwinkle: (twinkle) => set({ twinkle }),
  setExposure: (exposure) => set({ exposure }),
  toggleLabels: () => set((s) => ({ labels: !s.labels })),
  toggleLines: () => set((s) => ({ lines: !s.lines })),
  toggleGrid: () => set((s) => ({ grid: !s.grid })),
  setScrollPhase: (scrollPhase) => set({ scrollPhase }),
}));