varying vec3 vColor;
varying float vSize;
void main() {
  float r = length(gl_PointCoord - vec2(0.5));
  float core = 1.0 - smoothstep(0.0, 0.25, r);
  float halo = 0.15 * (1.0 - smoothstep(0.0, 0.5, r));
  gl_FragColor = vec4(vColor, (core + halo) * clamp(vSize / 4.0, 0.08, 0.45));
}
