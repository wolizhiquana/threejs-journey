import { useAnimations, useGLTF } from '@react-three/drei'
import { button, useControls } from 'leva'
import { useEffect } from 'react'

function Fox() {
  const { animations, scene } = useGLTF('Fox/glTF/Fox.gltf')

  const { actions, names } = useAnimations(animations, scene)

  const { animationName } = useControls('fox', {
    animationName: { options: names }
  })

  useEffect(() => {
    const action = actions[animationName]!
    action.reset().fadeIn(0.5).play()

    return () => {
      action.fadeOut(0.5)
    }
  }, [animationName])

  return <primitive object={scene} scale={0.02} position-y={-1} />
}

export default Fox
