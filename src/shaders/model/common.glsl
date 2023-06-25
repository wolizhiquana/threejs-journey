#include <common>

uniform float uTime;
uniform float uRotateStrength;

mat2 get2dRotateMatrix(float angle) {
  return mat2(cos(angle), -sin(angle), sin(angle), cos(angle));
}