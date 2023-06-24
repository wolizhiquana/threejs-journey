import * as dat from 'lil-gui'
import * as THREE from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'
import fragmentShader from './shaders/water/fragment.glsl'
import vertexShader from './shaders/water/vertex.glsl'
import Stats from 'three/examples/jsm/libs/stats.module.js'

THREE.ColorManagement.enabled = false

/**
 * Base
 */
// Debug
const gui = new dat.GUI({ width: 340 })
const debugObject = {}

// Canvas
const canvas = document.querySelector('canvas.webgl')

// Scene
const scene = new THREE.Scene()

// State
const stats = new Stats()
document.body.appendChild(stats.dom)

/**
 * Sizes
 */
const sizes = {
  width: window.innerWidth,
  height: window.innerHeight
}

window.addEventListener('resize', () => {
  // Update sizes
  sizes.width = window.innerWidth
  sizes.height = window.innerHeight

  // Update camera
  camera.aspect = sizes.width / sizes.height
  camera.updateProjectionMatrix()

  // Update renderer
  renderer.setSize(sizes.width, sizes.height)
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
})

/**
 * Camera
 */
// Base camera
const camera = new THREE.PerspectiveCamera(
  75,
  sizes.width / sizes.height,
  0.1,
  100
)
camera.position.set(1, 1, 1)
scene.add(camera)

/**
 * Water
 */
// Geometry
const waterGeometry = new THREE.PlaneGeometry(20, 20, 1024, 1024)

// Color
debugObject.depthColor = '#186691'
debugObject.surfaceColor = '#9bd8ff'
debugObject.fogColor = '#030f1c'

// Material
const waterMaterial = new THREE.ShaderMaterial({
  vertexShader,
  fragmentShader,
  uniforms: {
    uTime: { value: 0 },

    uBigWaveFrequency: { value: new THREE.Vector2(1.5, 1) },
    uBigWaveElevation: { value: 0.2 },
    uBigWaveSpeed: { value: 1 },

    uSmallWaveElevation: { value: 0.15 },
    uSmallWaveFrequency: { value: 3 },
    uSmallWaveSpeed: { value: 0.5 },
    uSmallWaveIteration: { value: 4 },

    uDepthColor: { value: new THREE.Color(debugObject.depthColor) },
    uSurfaceColor: { value: new THREE.Color(debugObject.surfaceColor) },
    uColorOffset: { value: 0.02 },
    uColorMultiplier: { value: 4 },

    uCameraPosition: { value: camera.position },
    uFogColor: { value: new THREE.Color(debugObject.fogColor) },
    uFogNear: { value: 5 },
    uFogFar: { value: 12 }
  }
})

const bigWaveGui = gui.addFolder('大波浪')
bigWaveGui
  .add(waterMaterial.uniforms.uBigWaveElevation, 'value')
  .min(0)
  .max(1)
  .step(0.01)
  .name('高度')
bigWaveGui
  .add(waterMaterial.uniforms.uBigWaveFrequency.value, 'x')
  .min(0)
  .max(10)
  .step(0.01)
  .name('频率X')
bigWaveGui
  .add(waterMaterial.uniforms.uBigWaveFrequency.value, 'y')
  .min(0)
  .max(10)
  .step(0.01)
  .name('频率Y')
bigWaveGui
  .add(waterMaterial.uniforms.uBigWaveSpeed, 'value')
  .min(0)
  .max(4)
  .step(0.01)
  .name('速度')

const smallWave = gui.addFolder('小波浪')
smallWave
  .add(waterMaterial.uniforms.uSmallWaveElevation, 'value')
  .min(0)
  .max(1)
  .step(0.01)
  .name('高度')
smallWave
  .add(waterMaterial.uniforms.uSmallWaveFrequency, 'value')
  .min(0)
  .max(30)
  .step(0.01)
  .name('频率')
smallWave
  .add(waterMaterial.uniforms.uSmallWaveSpeed, 'value')
  .min(0)
  .max(4)
  .step(0.01)
  .name('速度')
smallWave
  .add(waterMaterial.uniforms.uSmallWaveIteration, 'value')
  .min(1)
  .max(5)
  .step(1)
  .name('迭代次数')

gui
  .addColor(debugObject, 'surfaceColor')
  .name('浅层颜色')
  .onChange(() =>
    waterMaterial.uniforms.uSurfaceColor.value.set(
      new THREE.Color(debugObject.surfaceColor)
    )
  )
gui
  .addColor(debugObject, 'depthColor')
  .name('深层颜色')
  .onChange(() =>
    waterMaterial.uniforms.uDepthColor.value.set(
      new THREE.Color(debugObject.depthColor)
    )
  )
gui
  .add(waterMaterial.uniforms.uColorOffset, 'value')
  .min(0)
  .max(1)
  .step(0.01)
  .name('混色偏移')
gui
  .add(waterMaterial.uniforms.uColorMultiplier, 'value')
  .min(0)
  .max(10)
  .step(0.01)
  .name('混色倍增')

const fogGui = gui.addFolder('雾气')
fogGui
  .addColor(debugObject, 'fogColor')
  .name('颜色')
  .onChange(() => {
    waterMaterial.uniforms.uFogColor.value.set(
      new THREE.Color(debugObject.fogColor)
    )
  })
fogGui
  .add(waterMaterial.uniforms.uFogNear, 'value')
  .min(0)
  .max(100)
  .step(0.01)
  .name('最小距离')
fogGui
  .add(waterMaterial.uniforms.uFogFar, 'value')
  .min(0)
  .max(100)
  .step(0.01)
  .name('最大距离')

// Mesh
const water = new THREE.Mesh(waterGeometry, waterMaterial)
water.rotation.x = -Math.PI * 0.5
scene.add(water)

// Controls
const controls = new OrbitControls(camera, canvas)
controls.enableDamping = true

/**
 * Renderer
 */
const renderer = new THREE.WebGLRenderer({
  canvas: canvas
})
renderer.setSize(sizes.width, sizes.height)
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))

/**
 * Animate
 */
const clock = new THREE.Clock()

const tick = () => {
  const elapsedTime = clock.getElapsedTime()

  // Update material
  waterMaterial.uniforms.uTime.value = elapsedTime

  // Render
  renderer.render(scene, camera)
  stats.update()

  // Call tick again on the next frame
  window.requestAnimationFrame(tick)
}

tick()
