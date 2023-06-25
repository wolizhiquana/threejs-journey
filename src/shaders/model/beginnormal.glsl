#include <beginnormal_vertex>

float angle = sin(position.y + uTime) * uRotateStrength;
mat2 rotateMatrix = get2dRotateMatrix(angle);

objectNormal.xz = rotateMatrix * objectNormal.xz;