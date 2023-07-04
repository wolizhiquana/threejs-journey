import { DepthOfField, EffectComposer } from '@react-three/postprocessing'

function Effects() {
  return (
    <EffectComposer>
      <DepthOfField focusDistance={0.01} focalLength={0.2} bokehScale={3} />
    </EffectComposer>
  )
}

export default Effects
