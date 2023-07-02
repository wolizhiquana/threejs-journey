import {
  ContactShadows,
  Environment,
  Float,
  Html,
  PresentationControls,
  Text,
  useGLTF
} from '@react-three/drei'

export default function Experience() {
  const { scene } = useGLTF(
    'https://vazxmixjsiawhamofees.supabase.co/storage/v1/object/public/models/macbook/model.gltf'
  )

  return (
    <>
      <Environment preset='city' />

      <color args={['#241a1a']} attach='background' />

      <PresentationControls
        global
        snap
        rotation={[0.13, 0.1, 0]}
        polar={[-0.4, 0.2]}
        azimuth={[-1, 0.75]}
        config={{ mass: 2, tension: 400 }}
      >
        <Float rotationIntensity={0.4}>
          {/* Screen colr */}
          <rectAreaLight
            width={2.5}
            height={1.65}
            intensity={65}
            color={'#867f7f'}
            rotation={[0.1, Math.PI, 0]}
            position={[0, 0.55, -1.55]}
          />
          {/* Model and screen */}
          <primitive object={scene} position-y={-1.2}>
            <Html
              transform
              wrapperClass='htmlScreen'
              distanceFactor={1.17}
              position={[0, 1.56, -1.4]}
              rotation-x={-0.256}
            >
              <iframe src='https://game-hub-two.vercel.app/' />
            </Html>
          </primitive>
          <Text
            font='bangers-v20-latin-regular.woff'
            position={[2, 0.75, 0.75]}
            rotation-y={-1.25}
            maxWidth={2}
            textAlign='center'
          >
            BRUNO SIMON
          </Text>
        </Float>
      </PresentationControls>

      <ContactShadows position-y={-1.4} opacity={0.4} scale={5} />
    </>
  )
}
