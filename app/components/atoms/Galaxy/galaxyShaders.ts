export const vertexShader = `
attribute vec2 uv;
attribute vec2 position;

varying vec2 vUv;

void main() {
  vUv = uv;
  gl_Position = vec4(position, 0, 1);
}
`;

export const fragmentShader = `
precision highp float;

uniform float uTime;
uniform vec3 uResolution;
uniform vec2 uFocal;
uniform vec2 uRotation;
uniform float uStarSpeed;
uniform float uDensity;
uniform float uHueShift;
uniform float uSpeed;
uniform vec2 uMouse;
uniform float uGlowIntensity;
uniform float uSaturation;
uniform bool uMouseRepulsion;
uniform float uTwinkleIntensity;
uniform float uRotationSpeed;
uniform float uRepulsionStrength;
uniform float uMouseActiveFactor;
uniform float uAutoCenterRepulsion;
uniform bool uTransparent;
uniform bool uIsDark;

uniform vec3 uColorRed;
uniform vec3 uColorOrange;
uniform vec3 uColorYellow;
uniform vec3 uColorWhite;
uniform vec3 uColorBlue;
uniform vec3 uBackgroundColor;

varying vec2 vUv;

// Simple hash function for dither noise
float hash(vec2 p) {
  p = fract(p * vec2(123.34, 456.21));
  p += dot(p, p + 45.32);
  return fract(p.x * p.y);
}

// Generate blue noise-like dither value in range [-0.5, 0.5] in [0,1] space
float dither(vec2 uv) {
  return hash(uv + uTime * 0.1) - 0.5;
}

#define NUM_LAYER 4.0
#define MAT45 mat2(0.7071, -0.7071, 0.7071, 0.7071)
#define PERIOD 3.0

float Hash21(vec2 p) {
  p = fract(p * vec2(123.34, 456.21));
  p += dot(p, p + 45.32);
  return fract(p.x * p.y);
}

float tri(float x) {
  return abs(fract(x) * 2.0 - 1.0);
}

float tris(float x) {
  float t = fract(x);
  return 1.0 - smoothstep(0.0, 1.0, abs(2.0 * t - 1.0));
}

float trisn(float x) {
  float t = fract(x);
  return 2.0 * (1.0 - smoothstep(0.0, 1.0, abs(2.0 * t - 1.0))) - 1.0;
}

vec3 getRealisticStarColor(float tempRand) {
  // Realistic stellar blackbody spectrum:
  // Red (0.00-0.25) -> Orange (0.25-0.50) -> Yellow (0.50-0.75) -> White (0.75-0.90) -> Light Blue (0.90-1.00)
  // Strictly excludes green, cyan, purple, pink, and dark blue.
  float t4 = tempRand * 4.0;
  if (tempRand < 0.25) {
    return mix(uColorRed, uColorOrange, t4);
  } else if (tempRand < 0.50) {
    return mix(uColorOrange, uColorYellow, t4 - 1.0);
  } else if (tempRand < 0.75) {
    return mix(uColorYellow, uColorWhite, t4 - 2.0);
  }
  return mix(uColorWhite, uColorBlue, t4 - 3.0);
}

vec3 StarLayer(vec2 uv) {
  vec3 col = vec3(0.0);

  vec2 gv = fract(uv) - 0.5; 
  vec2 id = floor(uv);
  float timeSpeed = uTime * uSpeed;

  for (int y = -1; y <= 1; y++) {
    for (int x = -1; x <= 1; x++) {
      vec2 offset = vec2(float(x), float(y));
      vec2 si = id + offset;
      float seed = Hash21(si);
      
      vec2 pad = vec2(
        tris(seed * 34.0 + timeSpeed * 0.1),
        tris(seed * 38.0 + timeSpeed * 0.0333333)
      ) - 0.5;

      vec2 delta = gv - offset - pad;
      float distSq = dot(delta, delta);

      // Early culling: outside radius of 1.0 (smoothstep(1.0, 0.2, d) is 0.0)
      if (distSq >= 1.0) continue;

      float d = sqrt(distSq);
      float size = fract(seed * 345.32);
      float star = (0.05 * uGlowIntensity) / max(d, 0.001);

      // Only compute expensive flare rays for top 10% brightest stars
      if (size > 0.9) {
        float glossLocal = tri(uStarSpeed / (PERIOD * seed + 1.0));
        float flareSize = (size - 0.9) * 10.0 * glossLocal;
        if (flareSize > 0.001) {
          float ray1 = max(0.0, 1.0 - abs(delta.x * delta.y * 1000.0));
          vec2 rotDelta = MAT45 * delta;
          float ray2 = max(0.0, 1.0 - abs(rotDelta.x * rotDelta.y * 1000.0));
          star += (ray1 + ray2 * 0.3) * flareSize * uGlowIntensity;
        }
      }

      star *= smoothstep(1.0, 0.2, d);

      float tempRand = fract(seed * 789.123);
      vec3 starBaseColor = getRealisticStarColor(tempRand);

      float twinkle = trisn(timeSpeed + seed * 6.2831) * 0.5 + 1.0;
      twinkle = mix(1.0, twinkle, uTwinkleIntensity);
      star *= twinkle;
      
      col += star * size * starBaseColor;
    }
  }

  return col;
}

void main() {
  vec2 focalPx = uFocal * uResolution.xy;
  vec2 uv = (vUv * uResolution.xy - focalPx) / uResolution.y;

  vec2 mouseNorm = uMouse - vec2(0.5);
  
  if (uAutoCenterRepulsion > 0.0) {
    vec2 centerUV = vec2(0.0, 0.0);
    float centerDist = length(uv - centerUV);
    vec2 repulsion = normalize(uv - centerUV) * (uAutoCenterRepulsion / (centerDist + 0.1));
    uv += repulsion * 0.05;
  } else if (uMouseRepulsion) {
    vec2 mousePosUV = (uMouse * uResolution.xy - focalPx) / uResolution.y;
    float mouseDist = length(uv - mousePosUV);
    vec2 repulsion = normalize(uv - mousePosUV) * (uRepulsionStrength / (mouseDist + 0.1));
    uv += repulsion * 0.05 * uMouseActiveFactor;
  } else {
    vec2 mouseOffset = mouseNorm * 0.1 * uMouseActiveFactor;
    uv += mouseOffset;
  }

  float autoRotAngle = uTime * uRotationSpeed;
  mat2 autoRot = mat2(cos(autoRotAngle), -sin(autoRotAngle), sin(autoRotAngle), cos(autoRotAngle));
  uv = autoRot * uv;

  uv = mat2(uRotation.x, -uRotation.y, uRotation.y, uRotation.x) * uv;

  vec3 col = vec3(0.0);

  for (float i = 0.0; i < 1.0; i += 1.0 / NUM_LAYER) {
    float depth = fract(i + uStarSpeed * uSpeed);
    float scale = mix(20.0 * uDensity, 0.5 * uDensity, depth);
    float fade = depth * smoothstep(1.0, 0.9, depth);
    col += StarLayer(uv * scale + i * 453.32) * fade;
  }

  if (uIsDark) {
    if (uTransparent) {
      // Dark mode transparent: additive starlight on DOM backdrop
      vec3 dithered = col + dither(vUv) * (1.0 / 255.0);
      gl_FragColor = vec4(dithered, 0.0);
    } else {
      // Dark mode opaque: starlight adds illumination and never darkens background
      vec3 finalColor = min(uBackgroundColor + col, vec3(1.0));
      vec3 dithered = finalColor + dither(vUv) * (1.0 / 255.0);
      gl_FragColor = vec4(dithered, 1.0);
    }
  } else {
    if (uTransparent) {
      // Light mode transparent: multiply starlight onto light DOM backdrop
      float alpha = min(length(col), 1.0);
      vec3 dithered = max(vec3(1.0) - col, vec3(0.0)) + dither(vUv) * (1.0 / 255.0);
      gl_FragColor = vec4(dithered, alpha);
    } else {
      // Light mode opaque: dark stars subtract from light background
      vec3 finalColor = max(uBackgroundColor - col, vec3(0.0));
      vec3 dithered = finalColor + dither(vUv) * (1.0 / 255.0);
      gl_FragColor = vec4(dithered, 1.0);
    }
  }
}
`;
