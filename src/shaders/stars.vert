varying vec3 vColor;
varying float vSize;
attribute vec3 color;
attribute float size;
void main() {
  vColor = color;
  vSize = size;
  vec4 mv = modelViewMatrix * vec4(position, 1.0);
  gl_PointSize = size * (300.0 / -mv.z);
  gl_Position = projectionMatrix * mv;
}
