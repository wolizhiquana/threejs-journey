import { Float, Text, useGLTF } from '@react-three/drei'
import { useFrame } from '@react-three/fiber'
import { CuboidCollider, RapierRigidBody, RigidBody } from '@react-three/rapier'
import * as THREE from 'three'
import { useMemo, useRef, useState } from 'react'

const boxGeometry = new THREE.BoxGeometry()

const floor1Material = new THREE.MeshStandardMaterial({ color: 'limegreen' })
const floor2Material = new THREE.MeshStandardMaterial({ color: 'greenyellow' })
const obstacleMaterial = new THREE.MeshStandardMaterial({ color: 'orangered' })
const walMaterial = new THREE.MeshStandardMaterial({ color: 'slategrey' })

interface BlockProps {
  position: [number, number, number]
}

export function BlockStart({ position = [0, 0, 0] }: BlockProps) {
  return (
    <group position={position}>
      <Float floatIntensity={0.25} rotationIntensity={0.25}>
        <Text
          font='bebas-neue-v9-latin-regular.woff'
          scale={0.4}
          maxWidth={0.5}
          lineHeight={0.75}
          textAlign='center'
          position={[1.25, 0.65, 0]}
        >
          Marble Race
          <meshBasicMaterial toneMapped={false} />
        </Text>
      </Float>
      <mesh
        geometry={boxGeometry}
        material={floor1Material}
        position-y={-0.1}
        scale={[4, 0.2, 4]}
        receiveShadow
      />
    </group>
  )
}

export function BlockSpiner({ position = [0, 0, 0] }: BlockProps) {
  const obstacle = useRef<RapierRigidBody>(null)
  const [speed] = useState(() =>
    (Math.random() + 0.2) * Math.random() < 0.5 ? -1 : 1
  )

  useFrame((state) => {
    if (!obstacle.current) return

    const time = state.clock.getElapsedTime()

    const rotation = new THREE.Quaternion()
    rotation.setFromEuler(new THREE.Euler(0, time * speed, 0))
    obstacle.current.setNextKinematicRotation(rotation)
  })

  return (
    <group position={position}>
      <mesh
        geometry={boxGeometry}
        material={floor2Material}
        position-y={-0.1}
        scale={[4, 0.2, 4]}
        receiveShadow
      />
      <RigidBody
        ref={obstacle}
        type='kinematicPosition'
        position={[0, 0.3, 0]}
        restitution={0.2}
        friction={0}
      >
        <mesh
          geometry={boxGeometry}
          material={obstacleMaterial}
          scale={[3.5, 0.3, 0.3]}
          castShadow
          receiveShadow
        />
      </RigidBody>
    </group>
  )
}

export function BlockLimbo({ position = [0, 0, 0] }: BlockProps) {
  const obstacle = useRef<RapierRigidBody>(null)
  const [timeOffset] = useState(() => Math.random() + Math.PI * 2)

  useFrame((state) => {
    if (!obstacle.current) return

    const time = state.clock.getElapsedTime()

    const y = Math.sin(time + timeOffset) + 1.25
    obstacle.current.setNextKinematicTranslation({
      x: position[0],
      y: position[1] + y,
      z: position[2]
    })
  })

  return (
    <group position={position}>
      <mesh
        geometry={boxGeometry}
        material={floor2Material}
        position-y={-0.1}
        scale={[4, 0.2, 4]}
        receiveShadow
      />
      <RigidBody
        ref={obstacle}
        type='kinematicPosition'
        position={[0, 0.3, 0]}
        restitution={0.2}
        friction={0}
      >
        <mesh
          geometry={boxGeometry}
          material={obstacleMaterial}
          scale={[3.5, 0.3, 0.3]}
          castShadow
          receiveShadow
        />
      </RigidBody>
    </group>
  )
}

export function BlockAxe({ position = [0, 0, 0] }: BlockProps) {
  const obstacle = useRef<RapierRigidBody>(null)
  const [timeOffset] = useState(() => Math.random() + Math.PI * 2)

  useFrame((state) => {
    if (!obstacle.current) return

    const time = state.clock.getElapsedTime()

    const x = Math.sin(time + timeOffset) * 1.25
    obstacle.current.setNextKinematicTranslation({
      x: position[0] + x,
      y: position[1] + 0.75,
      z: position[2]
    })
  })

  return (
    <group position={position}>
      <mesh
        geometry={boxGeometry}
        material={floor2Material}
        position-y={-0.1}
        scale={[4, 0.2, 4]}
        receiveShadow
      />
      <RigidBody
        ref={obstacle}
        type='kinematicPosition'
        position={[0, 0.3, 0]}
        restitution={0.2}
        friction={0}
      >
        <mesh
          geometry={boxGeometry}
          material={obstacleMaterial}
          scale={[1.5, 1.5, 0.2]}
          castShadow
          receiveShadow
        />
      </RigidBody>
    </group>
  )
}

export function BlockEnd({ position = [0, 0, 0] }: BlockProps) {
  const hamburger = useGLTF('hamburger.glb')

  hamburger.scene.children.forEach((child) => {
    child.castShadow = true
  })

  return (
    <group position={position}>
      <Text font='bebas-neue-v9-latin-regular.woff' position={[0, 2, 2]}>
        FINISH
        <meshBasicMaterial toneMapped={false} />
      </Text>
      <mesh
        geometry={boxGeometry}
        material={floor1Material}
        scale={[4, 0.2, 4]}
        receiveShadow
      />
      <RigidBody
        type='fixed'
        colliders='hull'
        position-y={0.25}
        restitution={0.2}
        friction={0}
      >
        <primitive castShadow object={hamburger.scene} scale={0.2} />
      </RigidBody>
    </group>
  )
}

function Bounds({ length = 1 }) {
  return (
    <RigidBody type='fixed' restitution={0.2} friction={0}>
      <mesh
        position={[-2.15, 0.75, -length * 2 + 2]}
        geometry={boxGeometry}
        material={walMaterial}
        scale={[0.3, 1.5, 4 * length]}
        receiveShadow
      />
      <mesh
        position={[2.15, 0.75, -length * 2 + 2]}
        geometry={boxGeometry}
        material={walMaterial}
        scale={[0.3, 1.5, 4 * length]}
        castShadow
      />
      <mesh
        position={[0, 0.75, -length * 4 + 2]}
        geometry={boxGeometry}
        material={walMaterial}
        scale={[4, 1.5, 0.3]}
        receiveShadow
      />
      <CuboidCollider
        args={[2, 0.1, 2 * length]}
        position={[0, -0.1, -(length * 2) + 2]}
        restitution={0.2}
        friction={1}
      />
    </RigidBody>
  )
}

export function Level({
  count = 5,
  types = [BlockSpiner, BlockAxe, BlockLimbo],
  seed = 0
}) {
  const blocks = useMemo(() => {
    const blocks = []
    for (let i = 0; i < count; i++) {
      const type = types[Math.floor(Math.random() * types.length)]
      blocks.push(type)
    }
    return blocks
  }, [count, types, seed])

  return (
    <>
      <BlockStart position={[0, 0, 0]} />
      {blocks.map((Block, index) => (
        <Block key={index} position={[0, 0, -(index + 1) * 4]} />
      ))}
      <BlockEnd position={[0, 0, -(count + 1) * 4]} />

      <Bounds length={count + 2} />
    </>
  )
}
