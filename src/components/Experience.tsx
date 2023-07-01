import { OrbitControls } from '@react-three/drei'
import { Perf } from 'r3f-perf'
import Model from './Model'

function Experience() {
  return (
    <>
      <Perf position='top-left' />

      <color args={['#030202']} attach='background' />
      <OrbitControls makeDefault />

      <Model />
    </>
  )
}

export default Experience
