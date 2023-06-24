#include utils/cnoise3D

uniform float uTime;
uniform float uBigWaveElevation;
uniform vec2 uBigWaveFrequency;
uniform float uBigWaveSpeed;

uniform float uSmallWaveElevation;
uniform float uSmallWaveFrequency;
uniform float uSmallWaveSpeed;
uniform float uSmallWaveIteration;
uniform vec3 uCameraPosition;

varying float vElevation;
varying float vDistance;
varying vec2 vUv;

void main () {
	vec4 modelPosition = modelMatrix *  vec4(position, 1.0);
	uv;

	// Elevation
	float elevation = sin(uBigWaveFrequency.x * modelPosition.x - uTime * uBigWaveSpeed) *
                    sin(uBigWaveFrequency.y * modelPosition.z - uTime * uBigWaveSpeed) *
                    uBigWaveElevation;

	for(float i = 1.0; i <= uSmallWaveIteration; i++) {
		elevation -= abs(
			cnoise(vec3(modelPosition.xz * uSmallWaveFrequency * i,uTime * uSmallWaveSpeed))
			) * uSmallWaveElevation / i;
	}
	modelPosition.y += elevation;

	vec4 viewPosition = viewMatrix * modelPosition;

	vec4 projectionPosition = projectionMatrix * viewPosition;

	gl_Position = projectionPosition;
	
	// Varyings
	vElevation = elevation;
	vDistance = distance(modelPosition.xyz, uCameraPosition);
	vUv = uv;
}