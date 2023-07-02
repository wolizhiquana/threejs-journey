import { useGLTF } from '@react-three/drei'

function Macbook(props: Record<string, any>) {
  const { scene } = useGLTF(
    'https://vazxmixjsiawhamofees.supabase.co/storage/v1/object/public/models/macbook/model.gltf'
  )
  return <primitive object={scene} position-y={-1.2} {...props} />
}

export default Macbook
