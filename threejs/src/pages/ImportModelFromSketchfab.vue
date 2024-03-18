<template>
    <div id="ss"></div>
</template>
<script setup lang="ts">
import { onMounted } from 'vue'
import * as THREE from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';
import { RGBELoader } from 'three-stdlib';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader';
import gsap from 'gsap'
const renderer = new THREE.WebGLRenderer()
renderer.setSize(window.innerWidth,window.innerHeight)
const scene = new THREE.Scene()
const camare = new THREE.PerspectiveCamera(40,window.innerWidth/window.innerHeight,0.1,1000)
const controls = new OrbitControls(camare,renderer.domElement)
camare.position.set(10,10,10)
controls.update()

renderer.outputColorSpace = THREE.SRGBColorSpace
renderer.toneMapping = THREE.ACESFilmicToneMapping
renderer.toneMappingExposure = 1.8

const loadingManager = new THREE.LoadingManager()
loadingManager.onStart = (url,loaded,total) => {
    console.log('Start loading...',url)
}
loadingManager.onProgress = (url,loaded,total) => {
    //total 是rgbeLoader和gltfLoader 资源的总和
    console.log('propress...',loaded / total)
}
loadingManager.onLoad=()=>{
    console.log('Just finish load')
}
// loadingManager.onError = (url) =>{
//     console.log('Error loading...',url)
// }
const rgbeLoader = new RGBELoader(loadingManager)
const gltfLoader = new GLTFLoader(loadingManager)
let car:any;
rgbeLoader.load('/MR_INT-001_NaturalStudio_NAD.hdr',(texture)=>{
    texture.mapping = THREE.EquirectangularReflectionMapping
    scene.environment = texture
    gltfLoader.load('/free_1975_porsche_911_930_turbo/scene.gltf',(gltf)=>{
        const model = gltf.scene
        scene.add(model)
        car = model
    })
})




// const ambientLight = new THREE.AmbientLight(0xffffff,10)
// scene.add(ambientLight)
const groundGeo = new THREE.PlaneGeometry(30,30)
const groundMat = new THREE.MeshStandardMaterial()
const ground = new THREE.Mesh(groundGeo,groundMat)
scene.add(ground)
ground.rotateX(- Math.PI / 2)
const gridHelper = new THREE.GridHelper(30,30)
scene.add(gridHelper)

//动画时间线
const timeLine = gsap.timeline()
window.addEventListener('mousedown',()=>{
    timeLine.to(camare.position,{
        z:20,
        duration:1,
        onUpdate:()=>{//保持相机朝向
            camare.lookAt(0,0,0)
        }
    })
    .to(camare.position,{
        y:20,
        duration:1,
        onUpdate:()=>{//保持相机朝向
            camare.lookAt(0,0,0)
        }
    })
    .to(camare.position,{
        x:10,
        y:5,
        z:3,
        duration:1,
        onUpdate:()=>{//保持相机朝向
            camare.lookAt(0,0,0)
        }
    })
})


const animate = (time:any) => {
    if(car) car.rotation.y =  - time / 3000
   
    renderer.render(scene,camare)
}
renderer.setAnimationLoop(animate)

window.addEventListener('resize',()=>{
    camare.aspect=window.innerWidth/window.innerHeight
    camare.updateProjectionMatrix()
    renderer.setSize(window.innerWidth,window.innerHeight)
})

onMounted(()=>{
    document.querySelector('#ss')?.appendChild(renderer.domElement)
})

</script>