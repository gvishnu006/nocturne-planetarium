export type Star = {
  id: string;
  ra: number; // hours
  dec: number; // degrees
  mag: number;
  bv?: number;
};

export type Constellation = {
  name: string;
  abbrev: string;
  lines: string[][];
};

export type SkyConfig = {
  name: string;
  bg: { top: string; mid: string; bottom: string };
  airglow: { strength: number; color: string };
  milkyWay: { enabled: boolean; strength: number; color: string };
  stars: { baseSize: number; maxSize: number; minMag: number };
};
