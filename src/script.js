import * as THREE from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js'
import * as dat from 'lil-gui'

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
 * Models
 */
let model = null

const gltfLoader = new GLTFLoader()
gltfLoader.load('models/Duck/glTF/Duck.gltf', (gltf) => {
  model = gltf.scene
  gltf.scene.position.y = -1.2
  scene.add(gltf.scene)
})

/**
 * Objects
 */
const object1 = new THREE.Mesh(
  new THREE.SphereGeometry(0.5, 16, 16),
  new THREE.MeshBasicMaterial({ color: '#ff0000' })
)
object1.position.x = -2

const object2 = new THREE.Mesh(
  new THREE.SphereGeometry(0.5, 16, 16),
  new THREE.MeshBasicMaterial({ color: '#ff0000' })
)

const object3 = new THREE.Mesh(
  new THREE.SphereGeometry(0.5, 16, 16),
  new THREE.MeshBasicMaterial({ color: '#ff0000' })
)
object3.position.x = 2

scene.add(object1, object2, object3)

/**
 * Ray caster
 */
const raycaster = new THREE.Raycaster()

// const rayOrigin = new THREE.Vector3(-3, 0, 0)
// const rayDirection = new THREE.Vector3(10, 0, 0)
// rayDirection.normalize()

// raycaster.set(rayOrigin, rayDirection)

// const intersect = raycaster.intersectObjects([object1, object2, object3])
// console.log(intersect)

// scene.add(raycaster)

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
 * Mouse
 */
const mouse = new THREE.Vector2()

window.onmousemove = (e) => {
  mouse.x = (e.clientX / sizes.width) * 2 - 1
  mouse.y = -((e.clientY / sizes.height) * 2) + 1
}

window.onclick = (e) => {
  if (currentIntersect) {
    switch (currentIntersect.object) {
      case object1:
        console.log('click on object1')
        break
      case object2:
        console.log('click on object2')
        break
      case object3:
        console.log('click on object3')
        break
    }
  }
}

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
camera.position.z = 3
scene.add(camera)

/**
 * Lights
 */
const ambientLight = new THREE.AmbientLight('#ffffff', 0.3)
scene.add(ambientLight)

const directionLight = new THREE.DirectionalLight('#ffffff', 0.7)
directionLight.position.set(1, 2, 3)
scene.add(directionLight)

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

let currentIntersect = null

const tick = () => {
  const elapsedTime = clock.getElapsedTime()

  // Animate objects
  object1.position.y = Math.sin(elapsedTime * 0.2) * 1.5
  object2.position.y = Math.sin(elapsedTime * 0.8) * 1.5
  object3.position.y = Math.sin(elapsedTime * 1.4) * 1.5

  // // Cast a ray
  raycaster.setFromCamera(mouse, camera)

  const objectsToTest = [object1, object2, object3]
  const intersects = raycaster.intersectObjects(objectsToTest)

  objectsToTest.forEach((obj) => {
    obj.material.color.set('#ff0000')
  })

  intersects.forEach((intersect) => {
    intersect.object.material.color.set('#0000ff')
  })

  if (intersects.length) {
    if (!currentIntersect) console.log('mouse enter')

    currentIntersect = intersects[0]
  } else {
    if (currentIntersect) console.log('mouse leave')
    currentIntersect = null
  }

  // Test Intersect with model
  if (model) {
    const modelIntersects = raycaster.intersectObject(model)
    if (modelIntersects.length) model.scale.set(1.2, 1.2, 1.2)
    else model.scale.set(1, 1, 1)
  }

  // Update controls
  controls.update()

  // Render
  renderer.render(scene, camera)

  // Call tick again on the next frame
  window.requestAnimationFrame(tick)
}

tick()
