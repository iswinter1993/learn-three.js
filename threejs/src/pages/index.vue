<template>
    <div id="container">

    </div>
</template>

<script lang="ts" setup>
import * as THREE from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import * as kokomi from "kokomi.js";
import { onMounted } from "vue";
import * as dat from "lil-gui";
import img from '@/assets/1705285132436.jpg'
import img2 from '@/assets/RzwqhImAV9H57xs.jpg'
import {GLTFLoader} from 'three/examples/jsm/loaders/GLTFLoader.js'
const demo = new URL('../assets/fushou-deng.glb',import.meta.url)

const renderer =new THREE.WebGLRenderer()
renderer.shadowMap.enabled=true
renderer.setSize(window.innerWidth,window.innerHeight)

const sence = new THREE.Scene()
const camare = new THREE.PerspectiveCamera(75,window.innerWidth/window.innerHeight,.1,1000)
const controls = new OrbitControls(camare,renderer.domElement)

const axesHelper = new THREE.AxesHelper(3)

sence.add(axesHelper)

camare.position.set(0,25,20)
controls.update()

const boxGeometry = new THREE.BoxGeometry();
const boxMaterial = new THREE.MeshBasicMaterial({color:0x00FF00})
const box = new THREE.Mesh(boxGeometry,boxMaterial)

sence.add(box)

const planeGeometry = new THREE.PlaneGeometry(30,30);
const planeMaterial = new THREE.MeshStandardMaterial({
    color:0xFFFFFF,
    side:THREE.DoubleSide
})
const plane = new THREE.Mesh(planeGeometry,planeMaterial)
plane.receiveShadow = true
plane.rotation.x = -0.5*Math.PI
sence.add(plane)

const gridHelper = new THREE.GridHelper(30)

sence.add(gridHelper)


const sphereGeometry = new THREE.SphereGeometry(4,50,50)
const sphereMaterial = new THREE.MeshStandardMaterial({
    color:0x0000FF,
    wireframe:false
})
const sphere = new THREE.Mesh(sphereGeometry,sphereMaterial)
sphere.position.set(-10,10,0)
sphere.castShadow=true

const gui = new dat.GUI()
const option={
    sqhereColor:'#ffea00',
    wireframe:false,
    speed:0.01,
    intensity:1,
    distance:0,
    angle:0.2,
    penumbra:0

}
gui.addColor(option,'sqhereColor').onChange((e)=>{
    sphere.material.color.set(e)
})
gui.add(option,'wireframe').onChange(e=>{
    sphere.material.wireframe=e
})

gui.add(option,'speed',0,0.1)

gui.add(option,'intensity',0,10000)

gui.add(option,'angle',0,1)

gui.add(option,'penumbra',0,1)

sence.add(sphere)

const ambientLight = new THREE.AmbientLight(0x333333)
sence.add(ambientLight)

// const directionalLight = new THREE.DirectionalLight(0xFFFFFF,10)
// sence.add(directionalLight)
// directionalLight.castShadow = true
// directionalLight.position.set(-30,50,0)

// const dLightHelper = new THREE.DirectionalLightHelper(directionalLight,5)
// sence.add(dLightHelper)

// directionalLight.shadow.camera.bottom = -12
// const dLightShadowHelper = new THREE.CameraHelper(directionalLight.shadow.camera)
// sence.add(dLightShadowHelper)

const spotLight = new THREE.SpotLight(0xFFFFFF,10000)
sence.add(spotLight)
spotLight.position.set(-100,100,0)
spotLight.castShadow = true
spotLight.angle=0.2
const sLightHelper = new THREE.SpotLightHelper(spotLight)
sence.add(sLightHelper)


// sence.fog = new THREE.Fog(0xffffff,0,200)
// sence.fog = new THREE.FogExp2(0xffffff,0.02)

// renderer.setClearColor(0xffea00)

const textureLoader = new THREE.TextureLoader()
// sence.background = textureLoader.load(img)

// const cubeTextureLoader = new THREE.CubeTextureLoader()
// sence.background = cubeTextureLoader.load([
//     img,
//     img,
//     img,
//     img,
//     img,
//     img
// ])

const box2MultiMaterial = [
    new THREE.MeshBasicMaterial({map:textureLoader.load(img)}),
    new THREE.MeshBasicMaterial({map:textureLoader.load(img)}),
    new THREE.MeshBasicMaterial({map:textureLoader.load(img2)}),
    new THREE.MeshBasicMaterial({map:textureLoader.load(img)}),
    new THREE.MeshBasicMaterial({map:textureLoader.load(img2)}),
    new THREE.MeshBasicMaterial({map:textureLoader.load(img)}),
]

const box2Geometry = new THREE.BoxGeometry(4,4,4)
const box2Material = new THREE.MeshBasicMaterial({
    // color:0x00ff00,
    // map:textureLoader.load(img)
})
const box2 = new THREE.Mesh(box2Geometry,box2MultiMaterial)
box2.position.set(0,15,10)
// box2.material.map=textureLoader.load(img)
sence.add(box2)




const plane2Geometry = new THREE.PlaneGeometry(10,10,10,10)
const plane2Material = new THREE.MeshBasicMaterial({color:'#fff',wireframe:true})
const plane2 = new THREE.Mesh(plane2Geometry,plane2Material)
sence.add(plane2)
plane2.position.set(10,10,15)
const vShader = `
    void main(){
        gl_Position = projectionMatrix * modelViewMatrix * vec4(position,1.);
    }
`
const fShader = `
    void main () {
        gl_FragColor = vec4(0.5, 0.5, 1.0, 1.0);
    }
`
const sphere2Geometry = new THREE.SphereGeometry(4)
const sphere2Material = new THREE.ShaderMaterial({
    vertexShader:vShader,
    fragmentShader:fShader
})
const sphere2 = new THREE.Mesh(sphere2Geometry,sphere2Material)
sence.add(sphere2)
sphere2.position.set(-5,10,10)


const assetsLoader = new GLTFLoader()
assetsLoader.load(demo.href,(gltf)=>{
    const model = gltf.scene
    sence.add(model)
    model.position.set(-12,4,10)
},undefined,(err)=>{
    console.log(err)
})

const lastPointZ = plane2.geometry.attributes.position.array.length - 1


let step = 0

const mousePosition = new THREE.Vector2();
window.addEventListener('mousemove',(e)=>{
    mousePosition.x = (e.clientX / window.innerWidth)*2 - 1
    mousePosition.y = 1 - (e.clientY / window.innerHeight)*2

})
const rayCaster = new THREE.Raycaster()
const sphereId = sphere.id
box2.name = 'box2'

const animate = (time) => {
    box.rotation.x =time/1000
    box.rotation.y =time/1000
    step+=option.speed
    sphere.position.y = 10*Math.abs(Math.sin(step))

    spotLight.angle=option.angle
    spotLight.intensity=option.intensity
    spotLight.penumbra=option.penumbra
    sLightHelper.update()


    rayCaster.setFromCamera(mousePosition,camare)
    const intersects = rayCaster.intersectObjects(sence.children)
    const intersectSphere = intersects.filter(v=>v.object.id === sphereId)
    const intersectBox2 = intersects.filter(v=>v.object.name === 'box2')
    if(intersectSphere.length) intersectSphere[0].object.material.color.set(0xff0000) 
    if(intersectBox2.length) {
        intersectBox2[0].object.rotation.x = time/1000
        intersectBox2[0].object.rotation.y = time/1000
    }
    // console.log(intersects)

    plane2.geometry.attributes.position.array[0] = 10*Math.random()
    plane2.geometry.attributes.position.array[1] = 10*Math.random()
    plane2.geometry.attributes.position.array[2] = 10*Math.random()
    plane2.geometry.attributes.position.array[lastPointZ] = 10*Math.random()
    plane2.geometry.attributes.position.needsUpdate=true

    renderer.render(sence,camare)
}


renderer.setAnimationLoop(animate)


window.addEventListener('resize',(ev)=>{
    camare.aspect = window.innerWidth/window.innerHeight
    camare.updateProjectionMatrix()
    renderer.setSize(window.innerWidth,window.innerHeight)
})

onMounted(()=>{
    document.querySelector('#container')?.appendChild(renderer.domElement)
})

</script>
<style lang="less">
    
</style>