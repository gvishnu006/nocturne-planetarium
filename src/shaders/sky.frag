varying vec2 vUv;
uniform vec3 topColor;
uniform vec3 bottomColor;
void main() {
  vUv = uv;
  vec3 c = mix(bottomColor, topColor, vUv.y);
  gl_FragColor = vec4(c, 1.0);
}
