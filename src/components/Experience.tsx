import { OrbitControls } from '@react-three/drei'
import { Perf } from 'r3f-perf'
import { useRef } from 'react'
import * as THREE from 'three'
import Model from './Model'

function Experience() {
  const icosahedron = useRef<THREE.Mesh>(null!)

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
