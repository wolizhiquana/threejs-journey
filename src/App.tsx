import { Canvas } from '@react-three/fiber'
import { Leva } from 'leva'
import Experience from './components/Experience'

function App() {
  return (
    <>
      <Leva />

      <Canvas
        flat
        shadows
        camera={{ fov: 45, near: 0.1, far: 200, position: [3, 2, 6] }}
      >
        <Experience />
      </Canvas>
    </>
  )
}

export default App
