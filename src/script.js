import * as THREE from 'three'
import { OrbitControls } from 'three/addons/controls/OrbitControls.js'
import * as dat from 'lil-gui'

/**
 * Textures
 */
const textureLoader = new THREE.TextureLoader()
const bakedShadow = textureLoader.load('textures/bakedShadow.jpg')
const simpleShadow = textureLoader.load('textures/simpleShadow.jpg')

/**
 * Base
 */
// Debug
const gui = new dat.GUI()

// Canvas
const canvas = document.querySelector('canvas.webgl')

// Scene
const scene = new THREE.Scene()

/**
 * Lights
 */
// Ambient light
const ambientLight = new THREE.AmbientLight(0xffffff, 0.4)
scene.add(ambientLight)

// Directional light
const directionalLight = new THREE.DirectionalLight(0xffffff, 0.5)
directionalLight.position.set(2, 2, -1)
directionalLight.castShadow = true

let distance = 1
directionalLight.shadow.mapSize.set(1024, 1024)
directionalLight.shadow.camera.top = distance
directionalLight.shadow.camera.right = distance
directionalLight.shadow.camera.bottom = -distance
directionalLight.shadow.camera.left = -distance
directionalLight.shadow.camera.near = 1
directionalLight.shadow.camera.far = 6
directionalLight.shadow.radius = 10

const directionLightCameraHelper = new THREE.CameraHelper(
  directionalLight.shadow.camera
)
directionLightCameraHelper.visible = false

scene.add(directionalLight)
scene.add(directionLightCameraHelper)

const directionalLightGui = gui.addFolder('单向光')
directionalLightGui.add(directionLightCameraHelper, 'visible').name('可视化')

// Spot Light
const spotLight = new THREE.SpotLight(0xffffff, 0.4, 10, Math.PI * 0.3)
spotLight.position.set(0, 2, 2)
spotLight.castShadow = true

spotLight.shadow.mapSize.set(1024, 1024)
spotLight.shadow.camera.fov = 30
spotLight.shadow.camera.near = 1
spotLight.shadow.camera.far = 6

const spotLightCameraHelper = new THREE.CameraHelper(spotLight.shadow.camera)
spotLightCameraHelper.visible = false

scene.add(spotLight)
scene.add(spotLightCameraHelper)

const spotLightGui = gui.addFolder('聚光灯')
spotLightGui.add(spotLightCameraHelper, 'visible').name('可视化')

// Point Light
const pointLight = new THREE.PointLight(0xffffff, 0.3)
pointLight.position.set(-1, 1, 0)
pointLight.castShadow = true

pointLight.shadow.mapSize.set(1024, 1024)
pointLight.shadow.camera.near = 0.1
pointLight.shadow.camera.far = 3

const pointLightCameraHelper = new THREE.CameraHelper(pointLight.shadow.camera)
pointLightCameraHelper.visible = false

scene.add(pointLight)
scene.add(pointLightCameraHelper)

const pointLightGui = gui.addFolder('点光源')
pointLightGui.add(pointLightCameraHelper, 'visible').name('可视化')

/**
 * Materials
 */
const material = new THREE.MeshStandardMaterial()
material.roughness = 0.7

/**
 * Objects
 */
const sphere = new THREE.Mesh(new THREE.SphereGeometry(0.5, 32, 32), material)
sphere.castShadow = true

const plane = new THREE.Mesh(
  new THREE.PlaneGeometry(5, 5),
  new THREE.MeshBasicMaterial({})
)
plane.rotation.x = -Math.PI * 0.5
plane.position.y = -0.5
plane.receiveShadow = true

scene.add(sphere, plane)

const sphereShadow = new THREE.Mesh(
  new THREE.PlaneGeometry(1.5, 1.5),
  new THREE.MeshBasicMaterial({
    color: 0x000000,
    transparent: true,
    alphaMap: simpleShadow
  })
)
sphereShadow.rotateX(-Math.PI * 0.5)
sphereShadow.position.y = -0.49
scene.add(sphereShadow)

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
camera.position.x = 1
camera.position.y = 1
camera.position.z = 2
scene.add(camera)

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

renderer.shadowMap.enabled = true
renderer.shadowMap.type = THREE.PCFSoftShadowMap

/**
 * Animate
 */
const clock = new THREE.Clock()

const tick = () => {
  const elapsedTime = clock.getElapsedTime()

  // update the sphere
  sphere.position.x = Math.cos(elapsedTime) * 1.5
  sphere.position.z = Math.sin(elapsedTime) * 1.5
  sphere.position.y = Math.abs(Math.sin(elapsedTime * 3))

  // update the shadow
  sphereShadow.position.x = sphere.position.x
  sphereShadow.position.z = sphere.position.z
  sphereShadow.material.opacity = (1 - sphere.position.y) * 0.3

  // Update controls
  controls.update()

  // Render
  renderer.render(scene, camera)

  // Call tick again on the next frame
  window.requestAnimationFrame(tick)
}

tick()
