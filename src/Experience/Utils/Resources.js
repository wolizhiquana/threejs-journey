import * as THREE from 'three'
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js'
import EventEmitter from './EventEmitter'

class Resources extends EventEmitter {
  constructor(sources) {
    super()

    // Options
    this.sources = sources

    // Setup
    this.items = {}
    this.toLoad = this.sources.length
    this.loaded = 0

    this.setLoaders()
    this.startLoading()
  }

  setLoaders() {
    this.loaders = {}
    this.loaders.gltfLoader = new GLTFLoader()
    this.loaders.textureLoader = new THREE.TextureLoader()
    this.loaders.cubeTextureLoader = new THREE.CubeTextureLoader()
  }

  startLoading() {
    this.sources.forEach((source) => {
      const { name, type, path } = source

      switch (type) {
        case 'gltfModel':
          this.loaders.gltfLoader.load(path, (gltf) => {
            this.sourceLoaded(name, gltf)
          })
          break
        case 'texture':
          this.loaders.textureLoader.load(path, (file) => {
            this.sourceLoaded(name, file)
          })
          break
        case 'cubeTexture':
          this.loaders.cubeTextureLoader.load(path, (file) => {
            this.sourceLoaded(name, file)
          })
          break
        default:
          break
      }
    })
  }

  sourceLoaded(name, file) {
    this.items[name] = file
    this.loaded++

    if (this.loaded === this.toLoad) this.trigger('ready')
  }
}

export default Resources
