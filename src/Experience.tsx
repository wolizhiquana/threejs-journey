import { OrbitControls, useGLTF } from '@react-three/drei'
import { useFrame } from '@react-three/fiber'
import {
  CuboidCollider,
  CylinderCollider,
  InstancedRigidBodies,
  InstancedRigidBodyProps,
  Physics,
  RapierRigidBody,
  RigidBody
} from '@react-three/rapier'
import { Perf } from 'r3f-perf'
import { useMemo, useRef, useState } from 'react'
import { Euler, Quaternion } from 'three'

export default function Experience() {
  const [hitSound] = useState(() => new Audio('hit.mp3'))

  const { scene: originium } = useGLTF('hamburger.glb')

  const cube = useRef<RapierRigidBody>(null!)
  const twister = useRef<RapierRigidBody>(null!)

  const cubeCount = 1000
  const cubes = useRef<RapierRigidBody[]>(null)
  const instances = useMemo(() => {
    const instances: InstancedRigidBodyProps[] = []

    for (let i = 0; i < cubeCount; i++) {
      const scaleRandom = Math.random()
      instances.push({
        key: 'instance_' + Math.random(),
        position: [
          (Math.random() - 0.5) * 8,
          6 + i * 0.2,
          (Math.random() - 0.5) * 8
        ],
        scale: [scaleRandom, scaleRandom, scaleRandom]
      })
    }

    return instances
  }, [])

  const handleJump = () => {
    const mass = cube.current.mass()
    cube.current.applyImpulse({ x: 0, y: 5 * mass, z: 0 }, true)
    cube.current.applyTorqueImpulse(
      {
        x: Math.random() - 0.5,
        y: Math.random() - 0.5,
        z: Math.random() - 0.5
      },
      true
    )
  }

  useFrame((state) => {
    const time = state.clock.getElapsedTime()

    const eulerRotation = new Euler(0, time * 3, 0)
    const quaternionRotation = new Quaternion()
    quaternionRotation.setFromEuler(eulerRotation)
    twister.current.setNextKinematicRotation(quaternionRotation)

    const angle = time * 0.5
    const x = Math.cos(angle) * 2
    const z = Math.sin(angle) * 2
    twister.current.setNextKinematicTranslation({ x, y: -0.8, z })
  })

  const collisionEnter = () => {
    hitSound.currentTime = 0
    hitSound.volume = Math.random()
    hitSound.play()
  }

  return (
    <>
      <Perf position='top-left' />

      <OrbitControls makeDefault />

      <directionalLight castShadow position={[1, 2, 3]} intensity={1.5} />
      <ambientLight intensity={0.5} />

      <Physics gravity={[0, -9.81, 0]}>
        <RigidBody colliders='ball'>
          <mesh castShadow position={[-1.5, 2, 0]}>
            <sphereGeometry />
            <meshStandardMaterial color='orange' />
          </mesh>
        </RigidBody>

        <RigidBody
          ref={cube}
          gravityScale={1}
          restitution={0}
          friction={0.7}
          colliders={false}
          onCollisionEnter={collisionEnter}
          onCollisionExit={() => console.log('exit')}
          onSleep={() => console.log('sleep')}
          onWake={() => console.log('wake')}
        >
          <CuboidCollider
            args={[0.5, 0.5, 0.5]}
            position={[1.5, 2, 0]}
            mass={0.5}
          />
          <mesh
            // ref={cube}
            castShadow
            position={[1.5, 2, 0]}
            rotation-x={Math.PI * 0.5}
            onClick={handleJump}
          >
            <boxGeometry />
            <meshStandardMaterial color='mediumpurple' />
          </mesh>
        </RigidBody>

        <RigidBody type='fixed' friction={0.7}>
          <mesh receiveShadow position-y={-1.25}>
            <boxGeometry args={[10, 0.5, 10]} />
            <meshStandardMaterial color='greenyellow' />
          </mesh>
        </RigidBody>

        <RigidBody
          ref={twister}
          position={[0, -0.8, 0]}
          friction={0}
          type='kinematicPosition'
        >
          <mesh castShadow scale={[0.4, 0.4, 4]}>
            <boxGeometry />
            <meshStandardMaterial color='red' />
          </mesh>
        </RigidBody>

        <RigidBody colliders={false} position={[0, 4, 0]}>
          <CylinderCollider args={[0.5, 1.25]} />
          <primitive object={originium} scale={0.25} />
        </RigidBody>

        <RigidBody type='fixed'>
          <CuboidCollider args={[5, 2, 0.5]} position={[0, 1, 5.5]} />
          <CuboidCollider args={[5, 2, 0.5]} position={[0, 1, -5.5]} />
          <CuboidCollider args={[0.5, 2, 5]} position={[5.5, 1, 0]} />
          <CuboidCollider args={[0.5, 2, 5]} position={[-5.5, 1, 0]} />
        </RigidBody>

        <InstancedRigidBodies ref={cubes} instances={instances}>
          <instancedMesh castShadow args={[undefined, undefined, cubeCount]}>
            <boxGeometry />
            <meshStandardMaterial color='red' />
          </instancedMesh>
        </InstancedRigidBodies>
      </Physics>
    </>
  )
}
