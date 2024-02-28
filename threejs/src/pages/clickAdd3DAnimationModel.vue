<template>
    <div id="main5"></div>
</template>
<script setup lang="ts">
import * as THREE from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import * as kokomi from "kokomi.js";
import { onMounted } from "vue";
import * as dat from "lil-gui";
import {GLTFLoader} from 'three/examples/jsm/loaders/GLTFLoader.js'
import * as SkeletonUtils from 'three/examples/jsm/utils/SkeletonUtils'
const Stag = new URL('../assets/Stag.gltf',import.meta.url)

const renderer = new THREE.WebGLRenderer({antialias:true})
renderer.setSize(window.innerWidth,window.innerHeight)
const scene = new THREE.Scene()
const camare = new THREE.PerspectiveCamera(70,window.innerWidth/window.innerHeight,0.1,10000)
const controls = new OrbitControls(camare,renderer.domElement)
camare.position.set(10,20,20)
controls.update()

const groundGeo = new THREE.PlaneGeometry(30,30)
const groundMat = new THREE.MeshBasicMaterial({
    visible:false,
    side:THREE.DoubleSide
})
const groundMesh = new THREE.Mesh(groundGeo,groundMat)
scene.add(groundMesh)
groundMesh.rotateX(-Math.PI/2)

const gridHelper = new THREE.GridHelper(30,30)
scene.add(gridHelper)


const planeGeo = new THREE.PlaneGeometry(1,1)
const planeMat = new THREE.MeshBasicMaterial({
    side:THREE.DoubleSide,
    color:0xffffff,
    transparent:true
})
const planeMesh = new THREE.Mesh(planeGeo,planeMat)
scene.add(planeMesh)
planeMesh.rotateX(-Math.PI/2)
planeMesh.position.set(0.5,0,0.5)

const ambientLight = new THREE.AmbientLight(0xffffff,10)
scene.add(ambientLight)

let mixers:any = []
let stag:any
let clips:any
const assetsLoader = new GLTFLoader()
assetsLoader.load(Stag.href,(glft)=>{
    const model = glft.scene
    model.scale.set(0.3,0.3,0.3)
    // scene.add(model)
    stag = model
    clips = glft.animations

})



const mousePosition = new THREE.Vector2()
const rayCaster = new THREE.Raycaster()
let intersects

window.addEventListener('mousemove',(e)=>{
    mousePosition.x = (e.clientX / window.innerWidth) * 2 - 1
    mousePosition.y = 1 - (e.clientY / window.innerHeight) * 2
    rayCaster.setFromCamera(mousePosition,camare)
    intersects = rayCaster.intersectObject(groundMesh)
    if(intersects.length > 0){
        const intersect = intersects[0]
        const planePosition = new THREE.Vector3().copy(intersect.point).floor().addScalar(0.5)
        planeMesh.position.set(planePosition.x,0,planePosition.z)
        const objExist = sphereArr.find((v:any )=> v.position.x === planeMesh.position.x && v.position.z === planeMesh.position.z)
        if(objExist){
            planeMesh.material.color.set(0xfff000)
        }else{
            planeMesh.material.color.set(0xffffff)
        }
    }
})

const sphereArr:any = []
// const sphereGeo = new THREE.SphereGeometry(0.5,4,2)
// const sphereMat = new THREE.MeshBasicMaterial({
//     wireframe:true,
//     color:0xfff000
// })
// const sphereMesh = new THREE.Mesh(sphereGeo,sphereMat)
window.addEventListener('click',()=>{
    const objExist = sphereArr.find((v:any )=> v.position.x === planeMesh.position.x && v.position.z === planeMesh.position.z)
    if(objExist) return
    if(intersects.length){
        // const sphereClone = sphereMesh.clone()
        // sphereArr.push(sphereClone)
        // scene.add(sphereClone)
        // sphereClone.position.set(planeMesh.position.x, 0.5 , planeMesh.position.z)
        planeMesh.material.color.set(0xfff000)

        const stagClone = SkeletonUtils.clone(stag)
        sphereArr.push(stagClone)
        scene.add(stagClone)
        stagClone.position.set(planeMesh.position.x,0,planeMesh.position.z)
        const mixer = new THREE.AnimationMixer(stagClone)
        const clip = THREE.AnimationClip.findByName(clips,'Idle_2')
        const action = mixer.clipAction(clip)
        action.play()
        mixers.push(mixer)
    }
    console.log(scene.children.length)
})


const clock = new THREE.Clock()
const animate = (time) => {
    const datetime = clock.getDelta()
    mixers.forEach(mixer => {
        mixer?.update(datetime)
    });
    planeMesh.material.opacity= 1 + Math.sin(time/120)
    renderer.render(scene,camare)
}
renderer.setAnimationLoop(animate)

window.addEventListener('resize',()=>{
    camare.aspect = window.innerWidth/window.innerHeight
    camare.updateProjectionMatrix()
    renderer.setSize(window.innerWidth,window.innerHeight)
})

onMounted(()=>{
    document.querySelector('#main5')?.appendChild(renderer.domElement)
})
</script>

<style lang="less">
    
</style>