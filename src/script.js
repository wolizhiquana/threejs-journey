import * as dat from 'lil-gui'
import * as THREE from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js'
import { DRACOLoader } from 'three/examples/jsm/loaders/DRACOLoader.js'
import firefliesVertexShader from './shaders/fireflies/vertex.glsl'
import firefliesFragmentShader from './shaders/fireflies/fragment.glsl'
import portalVertexShader from './shaders/portal/vertex.glsl'
import portalFragmentShader from './shaders/portal/fragment.glsl'

/**
 * Base
 */
// Debug
const debugObject = {}
const gui = new dat.GUI()

// Canvas
const canvas = document.querySelector('canvas.webgl')

// Scene
const scene = new THREE.Scene()

/**
 * Loaders
 */
// Texture loader
const textureLoader = new THREE.TextureLoader()

// Draco loader
const dracoLoader = new DRACOLoader()
dracoLoader.setDecoderPath('draco/')

// GLTF loader
const gltfLoader = new GLTFLoader()
gltfLoader.setDRACOLoader(dracoLoader)

/**
 * Textures
 */
const bakedTexture = textureLoader.load('baked.jpg')
bakedTexture.colorSpace = THREE.SRGBColorSpace

/**
 * Materials
 */
// Baked material
const bakedMaterial = new THREE.MeshBasicMaterial()
bakedMaterial.map = bakedTexture
bakedTexture.flipY = false

// Pole light material
const pointLightMaterial = new THREE.MeshBasicMaterial({ color: 0xffffe5 })

// Portal light material
debugObject.protalColorStart = '#000000'
debugObject.protalColorEnd = '#ffffff'

const portalLightMaterial = new THREE.ShaderMaterial({
  uniforms: {
    uTime: { value: 0 },
    uColorStart: { value: new THREE.Color(debugObject.protalColorStart) },
    uColorEnd: { value: new THREE.Color(debugObject.protalColorEnd) }
  },
  vertexShader: portalVertexShader,
  fragmentShader: portalFragmentShader
})

gui.addColor(debugObject, 'protalColorStart').onChange(() => {
  portalLightMaterial.uniforms.uColorStart.value.set(
    new THREE.Color(debugObject.protalColorStart)
  )
})
gui.addColor(debugObject, 'protalColorEnd').onChange(() => {
  portalLightMaterial.uniforms.uColorEnd.value.set(
    new THREE.Color(debugObject.protalColorEnd)
  )
})

/**
 * Model
 */
gltfLoader.load('portal.glb', (gltf) => {
  const bakedMesh = gltf.scene.children.find((child) => child.name === 'baked')
  bakedMesh.material = bakedMaterial

  const portalLight = gltf.scene.children.find(
    (child) => child.name === 'portalLight'
  )
  const poleLightAMesh = gltf.scene.children.find(
    (child) => child.name === 'poleLightA'
  )
  const poleLightBMesh = gltf.scene.children.find(
    (child) => child.name === 'poleLightB'
  )

  portalLight.material = portalLightMaterial
  poleLightAMesh.material = pointLightMaterial
  poleLightBMesh.material = pointLightMaterial

  scene.add(gltf.scene)
})

/**
 * Fireflies
 */
// Geometry
const firefliesGeometry = new THREE.BufferGeometry()
const firefliesCount = 30
const positionArray = new Float32Array(firefliesCount * 3)
const scaleArray = new Float32Array(firefliesCount)

for (let i = 0; i < firefliesCount; i++) {
  const i3 = i * 3

  positionArray[i3 + 0] = (Math.random() - 0.5) * 4
  positionArray[i3 + 1] = Math.random() * 1.5
  positionArray[i3 + 2] = (Math.random() - 0.5) * 4

  scaleArray[i] = Math.random()
}
firefliesGeometry.setAttribute(
  'position',
  new THREE.BufferAttribute(positionArray, 3)
)
firefliesGeometry.setAttribute(
  'aScale',
  new THREE.BufferAttribute(scaleArray, 1)
)

// Material
const firefliesMaterial = new THREE.ShaderMaterial({
  uniforms: {
    uTime: { value: 0 },
    uPixelRadio: { value: Math.min(window.devicePixelRatio, 2) },
    uSize: { value: 100 }
  },
  vertexShader: firefliesVertexShader,
  fragmentShader: firefliesFragmentShader,
  transparent: true,
  blending: THREE.AdditiveBlending,
  depthWrite: false
})

// Points
const fireflies = new THREE.Points(firefliesGeometry, firefliesMaterial)
scene.add(fireflies)

gui
  .add(firefliesMaterial.uniforms.uSize, 'value', 0, 500, 1)
  .name('firefliesSize')

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

  // Update fireflies
  firefliesMaterial.uniforms.uPixelRadio = Math.min(window.devicePixelRatio, 2)
})

/**
 * Camera
 */
// Base camera
const camera = new THREE.PerspectiveCamera(
  45,
  sizes.width / sizes.height,
  0.1,
  100
)
camera.position.x = 4
camera.position.y = 2
camera.position.z = 4
scene.add(camera)

// Controls
const controls = new OrbitControls(camera, canvas)
controls.enableDamping = true

/**
 * Renderer
 */
const renderer = new THREE.WebGLRenderer({
  canvas: canvas,
  antialias: true
})
renderer.setSize(sizes.width, sizes.height)
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))

debugObject.clearColor = '#201919'
renderer.setClearColor(debugObject.clearColor)
gui
  .addColor(debugObject, 'clearColor')
  .onChange(() => renderer.setClearColor(debugObject.clearColor))

/**
 * Animate
 */
const clock = new THREE.Clock()

const tick = () => {
  const elapsedTime = clock.getElapsedTime()

  // Update Shader uTime
  firefliesMaterial.uniforms.uTime.value = elapsedTime
  portalLightMaterial.uniforms.uTime.value = elapsedTime

  // Update controls
  controls.update()

  // Render
  renderer.render(scene, camera)

  // Call tick again on the next frame
  window.requestAnimationFrame(tick)
}

tick()
