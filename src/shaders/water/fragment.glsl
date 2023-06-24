#include utils/cnoise3D

uniform vec3 uDepthColor;
uniform vec3 uSurfaceColor;
uniform float uColorOffset;
uniform float uColorMultiplier;
uniform float uBigWaveElevation;

uniform vec3 uFogColor;
uniform float uFogNear;
uniform float uFogFar;

varying float vElevation;
varying float vDistance;
varying vec2 vUv;

void main() {
	// Wave color
	float depthMixStrength = (vElevation + uColorOffset) * uColorMultiplier;
	vec3 mixedColor = mix(uDepthColor, uSurfaceColor, depthMixStrength);

	// Foam color
	mixedColor += (sin(cnoise(vec3(vUv * 5.0, vElevation * 2.0)) * 10.0) / 2.0 + 0.5) * 0.5;

	// Fog color
	float fogMixStrength = clamp((vDistance - 1.0) / (uFogFar - uFogNear), 0.0, 1.0);
	mixedColor = mix(mixedColor, uFogColor, fogMixStrength);


	gl_FragColor = vec4(mixedColor, 1.0);
}