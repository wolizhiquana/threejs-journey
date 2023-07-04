import { useKeyboardControls } from '@react-three/drei'
import { useFrame } from '@react-three/fiber'
import { RapierRigidBody, RigidBody, useRapier } from '@react-three/rapier'
import { useEffect, useRef, useState } from 'react'
import * as THREE from 'three'
import useGame from './stores/useGame'

export enum Controls {
  forward = 'forward',
  backward = 'backward',
  leftward = 'leftward',
  rightward = 'rightward',
  jump = 'jump'
}

function Player() {
  const body = useRef<RapierRigidBody>(null)
  const [subscribeKeys, getKeys] = useKeyboardControls<Controls>()
  const { rapier, world } = useRapier()

  const [smoothedCameraPosition] = useState(() => new THREE.Vector3(10, 10, 10))
  const [smoothedCameraTarget] = useState(() => new THREE.Vector3())

  const start = useGame((state) => state.start)
  const end = useGame((state) => state.end)
  const restart = useGame((state) => state.restart)
  const blocksCount = useGame((state) => state.blocksCount)

  const jump = () => {
    if (!body.current) return

    const origin = body.current.translation()
    origin.y -= 0.31
    const direction = { x: 0, y: -1, z: 0 }
    const ray = new rapier.Ray(origin, direction)
    const hit = world.castRay(ray, 10, true)

    if (hit && hit.toi < 0.15)
      body.current.applyImpulse({ x: 0, y: 0.5, z: 0 }, true)
  }

  const reset = () => {
    body.current?.setTranslation({ x: 0, y: 1, z: 0 }, true)
    body.current?.setLinvel({ x: 0, y: 0, z: 0 }, true)
    body.current?.setAngvel({ x: 0, y: 0, z: 0 }, true)
  }

  useEffect(() => {
    const unsubscribeReset = useGame.subscribe(
      (state) => state.phase,
      (value) => {
        if (value === 'reading') reset()
      }
    )
    const unsubscribeJump = subscribeKeys(
      (state) => state.jump,
      (value) => {
        if (value === true) jump()
      }
    )

    const unsubscribeAnyKey = subscribeKeys(() => start())
    return () => {
      unsubscribeReset()
      unsubscribeJump()
      unsubscribeAnyKey()
    }
  }, [])

  useFrame((state, delta) => {
    if (!body.current) return

    // Controls
    const { forward, backward, leftward, rightward } = getKeys()

    const impluse = { x: 0, y: 0, z: 0 }
    const torque = { x: 0, y: 0, z: 0 }

    const impulseStrength = 0.6 * delta
    const torqueStrength = 0.2 * delta

    if (forward) {
      impluse.z -= impulseStrength
      torque.x -= torqueStrength
    }
    if (backward) {
      impluse.z += impulseStrength
      torque.x += torqueStrength
    }
    if (leftward) {
      impluse.x -= impulseStrength
      torque.z += torqueStrength
    }
    if (rightward) {
      impluse.x += impulseStrength
      torque.z -= torqueStrength
    }

    body.current.applyImpulse(impluse, true)
    body.current.applyTorqueImpulse(torque, true)

    // Camera
    const bodyPosition = body.current.translation() as THREE.Vector3

    const cameraPosition = new THREE.Vector3()
    cameraPosition.copy(bodyPosition)
    cameraPosition.z += 2.25
    cameraPosition.y += 0.25

    const cameraTarget = new THREE.Vector3()
    cameraTarget.copy(bodyPosition)
    cameraPosition.y += 0.25

    smoothedCameraPosition.lerp(cameraPosition, 5 * delta)
    smoothedCameraTarget.lerp(cameraTarget, 5 * delta)

    state.camera.position.copy(smoothedCameraPosition)
    state.camera.lookAt(smoothedCameraTarget)

    // Phases
    if (bodyPosition.z < -(blocksCount * 4 + 2)) end()

    if (bodyPosition.y < -4) restart()
  })

  return (
    <RigidBody
      ref={body}
      colliders='ball'
      restitution={0.2}
      friction={1}
      linearDamping={0.5}
      position={[0, 1, 0]}
    >
      <mesh castShadow>
        <icosahedronGeometry args={[0.3, 1]} />
        <meshStandardMaterial flatShading color='mediumpurple' />
      </mesh>
    </RigidBody>
  )
}

export default Player
