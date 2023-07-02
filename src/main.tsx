import { Canvas } from '@react-three/fiber'
import React from 'react'
import ReactDOM from 'react-dom/client'
import Experience from './Experience'
import './index.css'

ReactDOM.createRoot(document.getElementById('root') as HTMLElement).render(
  <React.StrictMode>
    <Canvas
      camera={{
        fov: 45,
        near: 0.1,
        far: 200,
        position: [-3, 1.5, 4]
      }}
    >
      <Experience />
    </Canvas>
  </React.StrictMode>
)
