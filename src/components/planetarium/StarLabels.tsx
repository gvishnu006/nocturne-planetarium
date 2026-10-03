import * as THREE from "three";
import { useFrame } from "@react-three/fiber";
import { useSkyStore } from "@/lib/skyStore";
import { observerBasis } from "@/lib/frame";
import labelsData from "../../../public/data/stars.labels.json";
import { labelDirection, labelText, type StarLabel } from "@/lib/catalog";
import { useMemo } from "react";

export function StarLabels() {
  const { gmst, latDeg, lonDeg, labels } = useSkyStore();
  const data = labelsData as Record<string, StarLabel>;

  const sprites = useMemo(() => {
    const group = new THREE.Group();
    if (!labels) return group;
    const canvas = document.createElement("canvas");
    const ctx = canvas.getContext("2d")!;
    canvas.width = 1024;
    canvas.height = 128;
    ctx.font = "48px system-ui, -apple-system, Inter";
    ctx.fillStyle = "rgba(235,240,255,0.85)";
    ctx.textBaseline = "middle";
    ctx.shadowColor = "rgba(10,12,30,0.9)";
    ctx.shadowBlur = 8;
    const radius = 90.5;
    let i = 0;
    for (const [name, l] of Object.entries(data)) {
      if (l.mag > 2.8) continue; // avoid clutter
      const txt = labelText(name, l);
      const w = ctx.measureText(txt).width;
      ctx.clearRect(0, 0, 1024, 128);
      ctx.fillText(txt, 20, 64);
      const tex = new THREE.CanvasTexture(canvas);
      tex.needsUpdate = true;
      const mat = new THREE.SpriteMaterial({ map: tex, transparent: true, opacity: 0.8, depthWrite: false });
      const sp = new THREE.Sprite(mat);
      const v = labelDirection(l.ra, l.dec);
      sp.position.set(v[0] * radius, v[1] * radius, v[2] * radius);
      sp.scale.set((w + 40) * 0.05, 1.4, 1);
      group.add(sp);
      i++;
      if (i > 120) break;
    }
    return group;
  }, [labels, data]);

  useFrame(() => {
    const m = observerBasis(latDeg, lonDeg, gmst);
    sprites.matrix.identity();
    sprites.applyMatrix4(new THREE.Matrix4().setFromMatrix3(m));
    sprites.visible = labels;
  });

  return <primitive object={sprites} />;
}