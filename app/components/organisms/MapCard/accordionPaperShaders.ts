/**
 * GLSL Vertex and Fragment Shaders for Continuous 3D WebGL Accordion Paper Folding
 *
 * Implements a single continuous parametric sheet deformed across 6 accordion panels.
 * Adjacent panels share identical vertices at fold boundaries, completely eliminating
 * tearing, gaps, and ripping.
 */

export const accordionVertexShader = `
precision highp float;

attribute vec3 position;
attribute vec2 uv;

uniform float uProgress;
uniform float uFoldAngle;
uniform float uAmplitude;

varying vec2 vUv;
varying vec3 vNormal;
varying float vPanelCoord;

void main() {
  vUv = uv;

  // Folding angle smoothly approaches 0 as uProgress -> 1
  float theta = uFoldAngle * (1.0 - uProgress);
  float cosTheta = cos(theta);
  float sinTheta = sin(theta);

  // 6 equal panels along the horizontal u axis
  float t = uv.x * 6.0;
  vPanelCoord = t;

  float panelIndex = clamp(floor(t), 0.0, 5.0);
  float frac = t - panelIndex;

  // Panel depth with configurable amplitude factor
  float deltaZ = (1.0 / 6.0) * sinTheta * uAmplitude;

  // Continuous Z height across alternating mountain and valley hinges
  // Even panels (0, 2, 4) rise from -0.5*deltaZ to +0.5*deltaZ (mountain ridge)
  // Odd panels (1, 3, 5) descend from +0.5*deltaZ to -0.5*deltaZ (valley groove)
  bool isEven = mod(panelIndex, 2.0) < 0.5;
  float z = isEven ? (frac - 0.5) * deltaZ : (0.5 - frac) * deltaZ;

  // Physical parabolic arch lift: paper lifts forward toward camera during unfold
  float archWave = sin(uProgress * 3.14159265);
  float dynamicLift = archWave * 0.18 * sin(uv.x * 3.14159265);
  float totalZ = z + dynamicLift;

  // Continuous projected X coordinate
  float x = (uv.x - 0.5) * cosTheta;
  float y = uv.y - 0.5;

  // Compute exact continuous surface normal in X-Z plane with amplitude scaling
  vec3 normal;
  if (isEven) {
    normal = normalize(vec3(-sinTheta * uAmplitude, 0.0, cosTheta));
  } else {
    normal = normalize(vec3(sinTheta * uAmplitude, 0.0, cosTheta));
  }
  vNormal = mix(normal, vec3(0.0, 0.0, 1.0), uProgress);

  // Perspective projection with pronounced focal depth and amplitude
  float camDist = 2.0;
  float zEff = camDist - totalZ;
  float projScale = camDist / max(zEff, 0.4);

  vec2 ndc = vec2(x * 2.0 * projScale, y * 2.0 * projScale);

  gl_Position = vec4(ndc, -totalZ * 0.5, 1.0);
}
`;

export const accordionFragmentShader = `
precision highp float;

uniform sampler2D uTexture;
uniform float uHasTexture;
uniform float uProgress;
uniform vec3 uBaseColor;

varying vec2 vUv;
varying vec3 vNormal;
varying float vPanelCoord;

void main() {
  vec4 tex = texture2D(uTexture, vUv);

  // Blend texture with base Solarized paper color based on alpha
  vec3 baseColor = uHasTexture > 0.5 ? mix(uBaseColor, tex.rgb, tex.a) : uBaseColor;

  // Directional lighting from top-left with enhanced chiaroscuro contrast
  vec3 lightDir = normalize(vec3(-0.45, 0.55, 0.70));
  float diff = clamp(dot(normalize(vNormal), lightDir), 0.0, 1.0);
  float lightIntensity = mix(0.68 + 0.32 * diff, 1.0, uProgress);

  // Mountain ridges at hinges 1, 3, 5 catch specular highlight
  float dMtn = min(abs(vPanelCoord - 1.0), min(abs(vPanelCoord - 3.0), abs(vPanelCoord - 5.0)));
  float mtnHighlight = smoothstep(0.12, 0.0, dMtn) * (1.0 - uProgress) * 0.28;

  // Valley grooves at hinges 2, 4 catch deep ambient occlusion shadow
  float dVly = min(abs(vPanelCoord - 2.0), abs(vPanelCoord - 4.0));
  float vlyShadow = smoothstep(0.14, 0.0, dVly) * (1.0 - uProgress) * 0.38;

  // Subtle paper grain dither to prevent banding
  float grain = (fract(sin(dot(vUv, vec2(12.9898, 78.233))) * 43758.5453) - 0.5) * 0.012;

  vec3 finalRgb = baseColor * lightIntensity * (1.0 - vlyShadow) + vec3(mtnHighlight) + vec3(grain);

  gl_FragColor = vec4(clamp(finalRgb, 0.0, 1.0), 1.0);
}
`;
