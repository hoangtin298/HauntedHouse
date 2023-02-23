import * as THREE from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'
import * as dat from 'dat.gui'
import gsap from 'gsap'
import './style.css'

/**
 * Debug
 */
const gui = new dat.GUI()

/**
 * Texture
 */
const textureLoader = new THREE.TextureLoader()

const doorColorTexture = textureLoader.load('textures/doors/color.jpeg')
const doorAlphaTexture = textureLoader.load('textures/doors/alpha.jpeg')
const doorAmbientOcclusionTexture = textureLoader.load(
  'textures/doors/ambientOcclusion.jpeg'
)
const doorHeightTexture = textureLoader.load('textures/doors/height.png')
const doorNormalTexture = textureLoader.load('textures/doors/normal.jpeg')
const doorMetalnessTexture = textureLoader.load('textures/doors/metalness.jpeg')
const doorRoughnessTexture = textureLoader.load('textures/doors/roughness.jpeg')

const brickColorTexture = textureLoader.load('textures/bricks/color.jpeg')
const brickAmbientOcclusionTexture = textureLoader.load(
  'textures/bricks/ambientOcclusion.jpeg'
)
const brickNormalTexture = textureLoader.load('textures/bricks/normal.jpeg')
const brickRoughnessTexture = textureLoader.load(
  'textures/bricks/roughness.jpeg'
)

const grassColorTexture = textureLoader.load('textures/grasses/color.jpeg')
const grassAmbientOcclusionTexture = textureLoader.load(
  'textures/grasses/ambientOcclusion.jpeg'
)
const grassNormalTexture = textureLoader.load('textures/grasses/normal.jpeg')
const grassRoughnessTexture = textureLoader.load(
  'textures/grasses/roughness.jpeg'
)
grassColorTexture.repeat.set(8, 8)
grassAmbientOcclusionTexture.repeat.set(8, 8)
grassNormalTexture.repeat.set(8, 8)
grassRoughnessTexture.repeat.set(8, 8)

grassColorTexture.wrapS = THREE.RepeatWrapping
grassAmbientOcclusionTexture.wrapS = THREE.RepeatWrapping
grassNormalTexture.wrapS = THREE.RepeatWrapping
grassRoughnessTexture.wrapS = THREE.RepeatWrapping

grassColorTexture.wrapT = THREE.RepeatWrapping
grassAmbientOcclusionTexture.wrapT = THREE.RepeatWrapping
grassNormalTexture.wrapT = THREE.RepeatWrapping
grassRoughnessTexture.wrapT = THREE.RepeatWrapping

const canvas = document.querySelector('canvas.webgl')
const sizes = {
  width: window.innerWidth,
  height: window.innerHeight
}

// Scene
const scene = new THREE.Scene()

// Camera
const camera = new THREE.PerspectiveCamera(
  75,
  sizes.width / sizes.height,
  0.1,
  100
)
camera.position.x = 4
camera.position.y = 2
camera.position.z = 5
scene.add(camera)

// Controls
const controls = new OrbitControls(camera, canvas)
controls.enableDamping = true
controls.minDistance = 4
controls.maxDistance = 15
controls.maxPolarAngle = Math.PI / 2 - 0.1

// Renderer
const renderer = new THREE.WebGLRenderer({
  canvas: canvas,
  antialias: true
})
renderer.setSize(sizes.width, sizes.height)
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
renderer.setClearColor('#262837')
renderer.shadowMap.enabled = true
renderer.shadowMap.type = THREE.PCFSoftShadowMap

/**
 * _____ Main ______
 */

// TEXTURES

// FOG
const fog = new THREE.Fog('#262837', 1, 20)
scene.fog = fog

// HOUSE
const house = new THREE.Group()
scene.add(house)

// WALL
const wall = new THREE.Mesh(
  new THREE.BoxGeometry(4, 2.5, 4),
  new THREE.MeshStandardMaterial({
    map: brickColorTexture,
    aoMap: brickAmbientOcclusionTexture,
    normalMap: brickNormalTexture,
    roughnessMap: brickRoughnessTexture
  })
)
wall.castShadow = true
wall.geometry.setAttribute(
  'uv2',
  new THREE.Float32BufferAttribute(wall.geometry.attributes.uv.array, 2)
)
wall.position.y = 2.5 / 2
house.add(wall)

// Roof
const roof = new THREE.Mesh(
  new THREE.ConeGeometry(3.5, 1, 4),
  new THREE.MeshStandardMaterial({ color: '#b35f45' })
)
roof.rotation.y = Math.PI * 0.25
roof.position.y = 2.5 + 0.5
house.add(roof)

// DOOR
const door = new THREE.Mesh(
  new THREE.PlaneGeometry(2.2, 2.2, 100, 100),
  new THREE.MeshStandardMaterial({
    map: doorColorTexture,
    transparent: true,
    alphaMap: doorAlphaTexture,
    aoMap: doorAmbientOcclusionTexture,
    displacementMap: doorHeightTexture,
    displacementScale: 0.1,
    normalMap: doorNormalTexture,
    metalnessMap: doorMetalnessTexture,
    roughnessMap: doorRoughnessTexture
    // wireframe: true
  })
)
door.geometry.setAttribute(
  'uv2',
  new THREE.Float32BufferAttribute(door.geometry.attributes.uv.array, 2)
)
door.position.y = 1
door.position.z = 2 + 0.01
house.add(door)

// BUSHES
const bushGeometry = new THREE.SphereGeometry(1, 16, 16)
const bushMaterial = new THREE.MeshStandardMaterial({
  map: grassColorTexture,
  aoMap: grassAmbientOcclusionTexture,
  roughnessMap: grassRoughnessTexture,
  roughnessMap: grassNormalTexture
})

const bush1 = new THREE.Mesh(bushGeometry, bushMaterial)
bush1.scale.set(0.5, 0.5, 0.5)
bush1.position.set(0.8, 0.2, 2.2)
const bush2 = new THREE.Mesh(bushGeometry, bushMaterial)
bush2.scale.set(0.25, 0.25, 0.25)
bush2.position.set(1.4, 0.1, 2.1)
const bush3 = new THREE.Mesh(bushGeometry, bushMaterial)
bush3.scale.set(0.4, 0.4, 0.4)
bush3.position.set(-0.8, 0.1, 2.2)
const bush4 = new THREE.Mesh(bushGeometry, bushMaterial)
bush4.scale.set(0.15, 0.15, 0.15)
bush4.position.set(-1, 0.05, 2.6)
bush1.castShadow = true
bush2.castShadow = true
bush3.castShadow = true
bush4.castShadow = true
scene.add(bush1, bush2, bush3, bush4)

// GRAVES
const graves = new THREE.Group()
scene.add(graves)

const graveGeometry = new THREE.BoxGeometry(0.6, 0.8, 0.2)
const graveMaterial = new THREE.MeshStandardMaterial({ color: '#b2b6b1' })

for (let index = 0; index < 50; index++) {
  const angle = Math.random() * Math.PI * 2
  // From 3 to 9
  const radius = 3 + Math.random() * 6
  const x = Math.sin(angle) * radius
  const z = Math.cos(angle) * radius

  const grave = new THREE.Mesh(graveGeometry, graveMaterial)
  grave.position.set(x, 0.4 + 0.01, z)
  grave.castShadow = true
  grave.rotation.y = (Math.random() - 0.5) * 2
  grave.rotation.z = (Math.random() - 0.5) * 0.4
  graves.add(grave)
}

// FLOOR
const floor = new THREE.Mesh(
  new THREE.PlaneGeometry(20, 20),
  new THREE.MeshStandardMaterial({
    map: grassColorTexture,
    aoMap: grassAmbientOcclusionTexture,
    roughnessMap: grassRoughnessTexture,
    roughnessMap: grassNormalTexture
  })
)
floor.receiveShadow = true
floor.geometry.setAttribute(
  'uv2',
  new THREE.Float32BufferAttribute(floor.geometry.attributes.uv.array, 2)
)
floor.rotation.x = -Math.PI * 0.5
floor.position.y = 0
scene.add(floor)

// LIGHTS
// Ambient light
const ambientLight = new THREE.AmbientLight('#b9d5ff', 0.12)
gui.add(ambientLight, 'intensity').min(0).max(1).step(0.001)
scene.add(ambientLight)

// Directional Light
const moonLight = new THREE.DirectionalLight('#b9d5ff', 0.12)
moonLight.position.set(4, 5, -2)
moonLight.castShadow = true
moonLight.shadow.mapSize.width = 256
moonLight.shadow.mapSize.height = 256
moonLight.shadow.camera.far = 7
gui.add(moonLight, 'intensity').min(0).max(1).step(0.001)
gui.add(moonLight.position, 'x').min(-5).max(5).step(0.001)
gui.add(moonLight.position, 'y').min(-5).max(5).step(0.001)
gui.add(moonLight.position, 'z').min(-5).max(5).step(0.001)
scene.add(moonLight)

const moonLightHelper = new THREE.DirectionalLightHelper(moonLight, 4)
scene.add(moonLightHelper)
moonLightHelper.visible = false

// DOOR LIGHT
const doorLight = new THREE.PointLight('#ff7d46', 1, 7)
doorLight.position.set(0, 2.2, 2.7)
doorLight.castShadow = true
doorLight.shadow.mapSize.width = 256
doorLight.shadow.mapSize.height = 256
doorLight.shadow.camera.far = 7
house.add(doorLight)

// GHOSTS
const ghost1 = new THREE.PointLight('#ff00ff', 2, 3)
scene.add(ghost1)

const ghost2 = new THREE.PointLight('#00ffff', 2, 3)
scene.add(ghost2)

const ghost3 = new THREE.PointLight('#ffff00', 2, 3)
scene.add(ghost3)

ghost1.castShadow = true
ghost2.castShadow = true
ghost3.castShadow = true

ghost1.shadow.mapSize.width = 256
ghost1.shadow.mapSize.height = 256
ghost1.shadow.camera.far = 7

ghost2.shadow.mapSize.width = 256
ghost2.shadow.mapSize.height = 256
ghost2.shadow.camera.far = 7

ghost3.shadow.mapSize.width = 256
ghost3.shadow.mapSize.height = 256
ghost3.shadow.camera.far = 7

/**
 * END _____ Main ______
 */

// Clock
const clock = new THREE.Clock()

// Animations
const tick = () => {
  const elapsedTime = clock.getElapsedTime()

  // Update ghosts
  const ghost1Angle = elapsedTime * 0.5
  ghost1.position.x = Math.cos(ghost1Angle) * 4
  ghost1.position.z = Math.sin(ghost1Angle) * 4
  ghost1.position.y = Math.sin(elapsedTime * 3)

  const ghost2Angle = -elapsedTime * 0.32
  ghost2.position.x = Math.cos(ghost2Angle) * 5
  ghost2.position.z = Math.sin(ghost2Angle) * 5
  ghost2.position.y = Math.sin(elapsedTime * 4) + Math.sin(elapsedTime * 2.5)

  const ghost3Angle = -elapsedTime * 0.18
  ghost3.position.x = Math.cos(ghost3Angle) * (7 + Math.sin(elapsedTime * 0.32))
  ghost3.position.z = Math.sin(ghost3Angle) * (7 + Math.sin(elapsedTime * 0.5))
  ghost3.position.y = Math.sin(elapsedTime * 4) + Math.sin(elapsedTime * 2.5)

  // Update controls
  controls.update()

  // Renderer
  renderer.render(scene, camera)

  window.requestAnimationFrame(tick)
}

tick()

window.addEventListener('resize', () => {
  // Update sizes
  sizes.width = window.innerWidth
  sizes.height = window.innerHeight
  // Update camera
  camera.aspect = sizes.width / sizes.height
  camera.updateProjectionMatrix()
  // Update renderer
  renderer.setSize(sizes.width, sizes.height)
  // Limit the pixel ratio
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
})
