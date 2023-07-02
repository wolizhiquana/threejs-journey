import { BlendFunction, Effect } from 'postprocessing'
import { Uniform, WebGLRenderTarget, WebGLRenderer } from 'three'

const fragmentShader = /* glsl */ `
  uniform float uFrequency;
  uniform float uAmplitude;
  uniform float uOffset;

  void mainImage(const in vec4 inputColor, const in vec2 uv, out vec4 outputColor) {
    outputColor = vec4(0.0, 1.0, 0.5, inputColor.a);
  }
  void mainUv(inout vec2 uv) {
    uv.y += sin(uv.x * uFrequency + uOffset) * uAmplitude;
  }
`

export interface DrunkEffectProps {
  frequency?: number
  amplitude?: number
  blendFunction?: BlendFunction
}

class DrunkEffect extends Effect {
  constructor({
    frequency = 10,
    amplitude = 0.1,
    blendFunction = BlendFunction.DARKEN
  }: DrunkEffectProps) {
    super('DrunkEffect', fragmentShader, {
      blendFunction,
      uniforms: new Map([
        ['uFrequency', new Uniform(frequency)],
        ['uAmplitude', new Uniform(amplitude)],
        ['uOffset', new Uniform(0)]
      ])
    })
  }

  update(
    _renderer: WebGLRenderer,
    _inputBuffer: WebGLRenderTarget,
    deltaTime?: number | undefined
  ): void {
    this.uniforms.get('uOffset')!.value += deltaTime
  }
}

export default DrunkEffect
