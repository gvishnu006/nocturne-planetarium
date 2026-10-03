varying vec2 vUv;
uniform float strength;
uniform vec3 color;
void main() {
  vec2 uv = vUv;
  float d = distance(uv, vec2(0.5, 0.5));
  float band = smoothstep(0.15, 0.45, d) * (1.0 - smoothstep(0.45, 0.8, d));
  float noise = sin(uv.y * 40.0 + uv.x * 20.0) * 0.5 + 0.5;
  float a = band * strength * (0.7 + 0.3 * noise);
  gl_FragColor = vec4(color, a * 0.25);
}
