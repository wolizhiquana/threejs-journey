import Experience from '../Experience'
import * as THREE from 'three'

class Enviroment {
  constructor() {
    this.experience = new Experience()
    this.scene = this.experience.scene
    this.resources = this.experience.resources
    this.debug = this.experience.debug

    // Debug
    if (this.debug.active)
      this.debugFolder = this.debug.ui.addFolder('enviroment')

    this.setSunLight()
    this.setEnviromentMap()
  }

  setSunLight() {
    this.sunLight = new THREE.DirectionalLight('#ffffff', 4)
    this.sunLight.castShadow = true
    this.sunLight.shadow.camera.top = 2
    this.sunLight.shadow.camera.right = 2
    this.sunLight.shadow.camera.bottom = -2
    this.sunLight.shadow.camera.left = -2
    this.sunLight.shadow.camera.near = 2
    this.sunLight.shadow.camera.far = 15
    this.sunLight.shadow.mapSize.set(1024, 1024)
    this.sunLight.shadow.normalBias = 0.02
    this.sunLight.position.set(3.5, 2, -1.25)
    this.scene.add(this.sunLight)

    // Debug
    if (this.debug.active) {
      this.debugFolder
        .add(this.sunLight, 'intensity')
        .name('sunLightIntensity')
        .min(0)
        .max(10)
        .step(0.1)
      this.debugFolder
        .add(this.sunLight.position, 'x')
        .name('sunLightX')
        .min(-5)
        .max(5)
        .step(0.1)
      this.debugFolder
        .add(this.sunLight.position, 'y')
        .name('sunLightY')
        .min(-5)
        .max(5)
        .step(0.1)
      this.debugFolder
        .add(this.sunLight.position, 'z')
        .name('sunLightZ')
        .min(-5)
        .max(5)
        .step(0.1)
    }
  }

  setEnviromentMap() {
    this.enviromentMap = {}
    this.enviromentMap.intensity = 2.4
    this.enviromentMap.texture = this.resources.items.enviromentMapTexture
    this.enviromentMap.texture.colorSpace = THREE.SRGBColorSpace
    this.scene.environment = this.enviromentMap.texture

    this.setEnviromentMap.updateMaterials = () => {
      this.scene.traverse((child) => {
        if (
          child instanceof THREE.Mesh &&
          child.material instanceof THREE.MeshStandardMaterial
        ) {
          child.material.envMap = this.enviromentMap.texture
          child.material.envMapIntensity = this.enviromentMap.intensity
          child.material.needsUpdate = true
        }
      })
    }

    this.setEnviromentMap.updateMaterials()

    // Debug
    if (this.debug.active) {
      this.debugFolder
        .add(this.enviromentMap, 'intensity')
        .name('envMapIntensity')
        .min(0)
        .max(4)
        .step(0.1)
        .onChange(this.setEnviromentMap.updateMaterials)
    }
  }
}

export default Enviroment
