/**
 * Star photometry, evaluated per-vertex on the GPU.
 *
 * The whole point of doing this in the shader is that a star's brightness
 * depends on where it is in the sky *right now*. As the sky turns, a star
 * sinking toward the horizon has to dim and redden, which means recomputing
 * for 8920 stars every frame. That is one multiply-add on the GPU and an
 * argument-passing problem on the CPU.
 */

/** Shared photometry block. Included by the star and glow shaders. */
const PHOTOMETRY = /* glsl */ `
  uniform mat3  uBasis;      // equatorial cartesian -> local (east, up, south)
  uniform float uLimitMag;   // faintest magnitude we draw
  uniform float uExposure;   // global gain
  uniform float uTime;
  uniform float uTwinkle;    // 0..1, scales scintillation
  uniform float uPixelRatio;

  // Pogson: 5 magnitudes is a factor of 100 in flux.
  float fluxFromMag(float m) {
    return pow(10.0, -0.4 * m);
  }

  // Kasten & Young (1989) airmass. Blows up at the horizon, as it should.
  float airmass(float altDeg) {
    float a = max(altDeg, -0.9);
    return 1.0 / (sin(radians(a)) + 0.50572 * pow(a + 6.07995, -1.6364));
  }

  // B-V to linear RGB, fitted to the main sequence. Desaturated by 28%,
  // because a real sky is very nearly achromatic.
  vec3 bvToRgb(float bv) {
    vec3 c;
    if (bv < 0.30) {
      c = mix(vec3(0.61, 0.70, 1.00), vec3(0.92, 0.94, 1.00), (bv + 0.35) / 0.65);
    } else if (bv < 0.58) {
      c = mix(vec3(0.92, 0.94, 1.00), vec3(1.00, 0.96, 0.90), (bv - 0.30) / 0.28);
    } else if (bv < 1.40) {
      c = mix(vec3(1.00, 0.96, 0.90), vec3(1.00, 0.76, 0.55), (bv - 0.58) / 0.82);
    } else {
      c = mix(vec3(1.00, 0.76, 0.55), vec3(1.00, 0.67, 0.42), clamp((bv - 1.40) / 0.60, 0.0, 1.0));
    }
    float grey = dot(c, vec3(0.2126, 0.7152, 0.0722));
    return mix(vec3(grey), c, 0.72);
  }

  // Extinction dims and reddens: blue scatters out of the line of sight faster.
  vec3 extinct(vec3 rgb, float magExt) {
    float red   = exp(-0.15 * magExt);
    float green = exp(-0.27 * magExt);
    float blue  = exp(-0.62 * magExt);
    return rgb * vec3(red, green, blue);
  }

  struct Star {
    vec3  dir;        // local direction, unit
    float altDeg;
    float magObs;     // extinction-corrected apparent magnitude
    vec3  color;
    float intensity;  // 0..1 display intensity
  };

  Star evaluateStar(vec3 eqDir, float mag, float bv) {
    Star s;
    vec3 local = uBasis * eqDir;
    s.dir = local;
    s.altDeg = degrees(asin(clamp(local.y, -1.0, 1.0)));

    float X = airmass(s.altDeg);
    float ext = 0.20 * (X - 1.0);
    s.magObs = mag + ext;

    s.color = extinct(bvToRgb(bv), max(ext, 0.0));

    // Perceptual response. A square-root-ish compression of flux keeps
    // Sirius from blowing out while 5000 sixth-magnitude specks stay visible.
    float f = fluxFromMag(s.magObs) * uExposure;
    s.intensity = clamp(pow(f, 0.5) * 2.6, 0.0, 1.0);

    return s;
  }
`;

export const starVertex = /* glsl */ `
  attribute vec3  position;   // equatorial cartesian, unit
  attribute float aMag;
  attribute float aBV;
  attribute float aPhase;     // per-star random phase for scintillation

  uniform float uSize;
  uniform float uRadius;

  varying vec3  vColor;
  varying float vIntensity;
  varying float vSpike;
  varying float vTwinkle;

  ${PHOTOMETRY}

  void main() {
    Star s = evaluateStar(position, aMag, aBV);

    // Scintillation: the atmosphere is a moving lens, and it disturbs
    // low stars far more than high ones. Amplitude scales with airmass.
    float X = airmass(s.altDeg);
    float amp = uTwinkle * clamp((X - 1.0) * 0.16, 0.0, 0.42);
    float t = uTime * 2.3 + aPhase;
    float tw = 1.0 + amp * (sin(t) * 0.6 + sin(t * 2.7 + 1.3) * 0.4);
    vTwinkle = tw;

    // Horizon fade. A star at the geometric horizon is behind kilometres of
    // air, and by -1 deg it is genuinely gone.
    float horizon = smoothstep(-1.2, 3.5, s.altDeg);

    vIntensity = s.intensity * horizon * tw;
    vColor = s.color;
    vSpike = pow(s.intensity, 3.0);

    // Bright stars bloom; faint ones stay pinpricks.
    float size = uSize * (0.62 + 1.85 * pow(s.intensity, 0.5));
    // Scintillation also makes them seem to swell and shrink slightly.
    size *= 1.0 + amp * 0.22;

    vec4 mv = modelViewMatrix * vec4(s.dir * uRadius, 1.0);
    gl_PointSize = size * uPixelRatio * (300.0 / max(-mv.z, 1.0));
    gl_Position = projectionMatrix * mv;
  }
`;

export const starFragment = /* glsl */ `
  precision highp float;

  varying vec3  vColor;
  varying float vIntensity;
  varying float vSpike;
  varying float vTwinkle;

  uniform float uOpacity;

  void main() {
    vec2 p = gl_PointCoord - 0.5;
    float r = length(p) * 2.0;

    // A tight core plus a wide faint skirt. Real point sources are not
    // gaussian discs, but to the eye and to an eyepiece they are close
    // enough that the core+skirt split reads correctly.
    float core = exp(-r * r * 9.0);
    float skirt = exp(-r * r * 2.1) * 0.16;

    // Faint diffraction spikes, only on the genuinely bright stars.
    vec2 a = abs(p) * 2.0;
    float spike = (exp(-a.x * 26.0) + exp(-a.y * 26.0)) * vSpike * 0.22;

    float alpha = (core + skirt + spike) * vIntensity * uOpacity;

    if (alpha < 0.002) discard;

    // Scintillation shifts colour slightly as well as brightness.
    vec3 tint = vColor * mix(1.0, 1.06, vTwinkle - 1.0);
    gl_FragColor = vec4(tint, clamp(alpha, 0.0, 1.0));
  }
`;