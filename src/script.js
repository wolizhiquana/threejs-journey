import * as THREE from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js'
import * as dat from 'lil-gui'

/**
 * Loaders
 */
const gltfLoader = new GLTFLoader()
const cubeTextureLoader = new THREE.CubeTextureLoader()

/**
 * Base
 */
// Debug
const gui = new dat.GUI()
const debugObj = {}

// Canvas
const canvas = document.querySelector('canvas.webgl')

// Scene
const scene = new THREE.Scene()

/**
 * Update all materials
 */
const updateAllMaterials = () => {
  scene.traverse((child) => {
    if (
      child instanceof THREE.Mesh &&
      child.material instanceof THREE.MeshStandardMaterial
    ) {
      // child.material.envMap = environmentMap
      child.material.envMapIntensity = debugObj.envMapIntensity
      child.castShadow = true
      child.receiveShadow = true
    }
  })
}

/**
 * Envrionment map
 */
const environmentMap = cubeTextureLoader.load([
  'textures/environmentMaps/0/px.jpg',
  'textures/environmentMaps/0/nx.jpg',
  'textures/environmentMaps/0/py.jpg',
  'textures/environmentMaps/0/ny.jpg',
  'textures/environmentMaps/0/pz.jpg',
  'textures/environmentMaps/0/nz.jpg'
])
environmentMap.colorSpace = THREE.SRGBColorSpace
// environmentMap.encoding = THREE.sRGBEncoding
scene.background = environmentMap
scene.environment = environmentMap

debugObj.envMapIntensity = 2.5
gui
  .add(debugObj, 'envMapIntensity')
  .min(0)
  .max(10)
  .step(0.1)
  .onChange(updateAllMaterials)

/**
 * Modeles
 */
gltfLoader.load('models/FlightHelmet/glTF/FlightHelmet.gltf', (gltf) => {
  gltf.scene.scale.set(10, 10, 10)
  gltf.scene.position.y = -4
  gltf.scene.rotateY = Math.PI * 0.5
  scene.add(gltf.scene)

  const gltfGui = gui.addFolder('模型')
  gltfGui
    .add(gltf.scene.rotation, 'y')
    .min(-Math.PI)
    .max(Math.PI)
    .step(0.1)
    .name('旋转')
  updateAllMaterials()
})

/**
 * Lights
 */
const directionLight = new THREE.DirectionalLight('#ffffff', 3)
directionLight.position.set(0.25, 3, -2.25)
directionLight.castShadow = true
directionLight.shadow.mapSize.set(1024, 1024)
directionLight.shadow.normalBias = 0.05
scene.add(directionLight)

const lightGui = gui.addFolder('光')
lightGui
  .add(directionLight, 'intensity')
  .name('光照强度')
  .min(0)
  .max(10)
  .step(0.1)
lightGui.add(directionLight.position, 'x').min(-5).max(5).step(0.1)
lightGui.add(directionLight.position, 'y').min(-5).max(5).step(0.1)
lightGui.add(directionLight.position, 'z').min(-5).max(5).step(0.1)

const directionLightCameraHelper = new THREE.CameraHelper(
  directionLight.shadow.camera
)
scene.add(directionLightCameraHelper)

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
camera.position.set(4, 1, -4)
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
renderer.physicallyCorrectLights = true
renderer.outputColorSpace = THREE.SRGBColorSpace
// renderer.outputEncoding = THREE.sRGBEncoding
renderer.toneMapping = THREE.ACESFilmicToneMapping
renderer.toneMappingExposure = 1
renderer.shadowMap.enabled = true
renderer.shadowMap.type = THREE.PCFSoftShadowMap

gui.add(renderer, 'toneMapping', {
  No: THREE.NoToneMapping,
  CineonToneMapping: THREE.CineonToneMapping,
  LinearToneMapping: THREE.LinearToneMapping,
  ReinhardToneMapping: THREE.ReinhardToneMapping,
  ACESFilmicToneMapping: THREE.ACESFilmicToneMapping
})
gui.add(renderer, 'toneMappingExposure').min(0).max(10).step(0.1)

/**
 * Animate
 */
const tick = () => {
  // Update controls
  controls.update()

  // Render
  renderer.render(scene, camera)

  // Call tick again on the next frame
  window.requestAnimationFrame(tick)
}

tick()
