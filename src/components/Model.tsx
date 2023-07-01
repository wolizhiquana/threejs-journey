import {
  Center,
  Sparkles,
  shaderMaterial,
  useGLTF,
  useTexture
} from '@react-three/drei'
import { Object3DNode, extend, useFrame } from '@react-three/fiber'
import { useRef } from 'react'
import { Color, ShaderMaterial } from 'three'
import { GLTF } from 'three-stdlib'
import portalFragmentShader from '../shaders/portal/fragment.glsl'
import portalVertexShader from '../shaders/portal/vertex.glsl'

type GLTFResult = GLTF & {
  nodes: {
    poleLightA: THREE.Mesh
    portalLight: THREE.Mesh
    poleLightB: THREE.Mesh
    baked: THREE.Mesh
  }
  materials: {}
}

interface PortalMaterialProps extends ShaderMaterial {
  uTime: number
  uColorStart: Color
  uColorEnd: Color
}

const PortalMaterial = shaderMaterial(
  {
    uTime: 0,
    uColorStart: new Color('#000000'),
    uColorEnd: new Color('#ffffff')
  },
  portalVertexShader,
  portalFragmentShader
)

extend({ PortalMaterial })

declare module '@react-three/fiber' {
  interface ThreeElements {
    portalMaterial: Object3DNode<PortalMaterialProps, typeof PortalMaterial>
  }
}

function Model() {
  const { nodes } = useGLTF('model/portal.glb') as GLTFResult
  const bakedTexture = useTexture('model/baked.jpg')

  const portalMaterial = useRef<PortalMaterialProps>(null!)
  useFrame((_state, delta) => {
    portalMaterial.current.uTime += delta
  })

  return (
    <Center>
      <mesh geometry={nodes.baked.geometry}>
        <meshBasicMaterial map={bakedTexture} map-flipY={false} />
      </mesh>

      <mesh
        geometry={nodes.poleLightA.geometry}
        position={nodes.poleLightA.position}
      >
        <meshBasicMaterial color='#ffffe5' />
      </mesh>

      <mesh
        geometry={nodes.poleLightB.geometry}
        position={nodes.poleLightB.position}
      >
        <meshBasicMaterial color='#ffffe5' />
      </mesh>

      <mesh
        geometry={nodes.portalLight.geometry}
        position={nodes.portalLight.position}
        rotation={nodes.portalLight.rotation}
      >
        <portalMaterial ref={portalMaterial} />
      </mesh>

      <Sparkles
        size={6}
        scale={[4, 2, 4]}
        position-y={1}
        speed={0.2}
        count={40}
      />
    </Center>
  )
}

export default Model
