<template>
    <div id="dd">
        
    </div>
</template>
<script setup lang="ts">
import * as THREE from 'three'
import { OrbitControls,RGBELoader,GLTFLoader,SkeletonUtils } from 'three-stdlib';
import gsap from 'gsap';
import { onMounted } from 'vue';
const renderer = new THREE.WebGLRenderer()
renderer.setSize(window.innerWidth,window.innerHeight)
renderer.setClearColor(0xFEFEFE);
const scene = new THREE.Scene()
const camera = new THREE.PerspectiveCamera(45,window.innerWidth/window.innerWidth,0.1,1000)
const controls = new OrbitControls(camera,renderer.domElement)
camera.position.set(10, 10, 20);
controls.update()
camera.lookAt(10,0,0)
const ambientLight = new THREE.AmbientLight(0xffffff)
scene.add(ambientLight)
const gridHelper = new THREE.GridHelper(12, 12);
scene.add(gridHelper);

// Sets the x, y, and z axes with each having a length of 4
const axesHelper = new THREE.AxesHelper(4);
scene.add(axesHelper);

let mixers:any;
let mixers1:any;
let mixers2:any;
let clips;
const gltfLoader = new GLTFLoader()
gltfLoader.load('../../public/phoenix_bird/scene.gltf',(gltf)=>{
    const model = gltf.scene
    model.scale.set(0.01,0.01,0.01)
    const phoenix_bird1 = SkeletonUtils.clone(model)
    const phoenix_bird2 = SkeletonUtils.clone(model)
    scene.add(model)
    scene.add(phoenix_bird1)
    scene.add(phoenix_bird2)
    phoenix_bird1.position.set(7,-4,6)
    phoenix_bird2.position.set(-7,4,-2)
    mixers = new THREE.AnimationMixer(model)
    mixers1 = new THREE.AnimationMixer(phoenix_bird1)
    mixers2 = new THREE.AnimationMixer(phoenix_bird2)
    clips = gltf.animations
    const clip = THREE.AnimationClip.findByName(clips,'Take 001')
    const action = mixers.clipAction(clip)
    const action1 = mixers1.clipAction(clip)
    const action2 = mixers2.clipAction(clip)
    action.play()
    action.timeScale=0.5
    action1.play()
    action1.startAt(0.2)
    action1.timeScale=0.5
    action2.play()
    action2.startAt(0.35)
    action2.timeScale=0.5
})
const timeLine = gsap.timeline()
const duration = 8
const ease = 'none'
let animationFinish = false
window.addEventListener('click',()=>{
    timeLine.to(camera.position,{
        x:0,
        ease,
        duration,
    })
    .to(camera.position,{
        y:40,
        z:30,
        ease,
        duration,
        onUpdate:()=>{
            camera.lookAt(0,0,0)
        }
    },8)
    .to(camera.position,{
        x:-10,
        y:15,
        z:10,
        ease,
        duration,
        onUpdate:()=>{
            camera.lookAt(0,0,0)
        }
    },8)
    .to(camera.position,{
        x:-30,
        y:30,
        z:20,
        ease,
        duration,
        onUpdate:()=>{
            camera.lookAt(0,0,0)
        }
    },14)
    .to(camera.position,{
        x:5,
        y:20,
        z:30,
        ease,
        duration,
        onUpdate:()=>{
            camera.lookAt(0,0,0)
        }
    },'>0.2')
})


const clock = new THREE.Clock()
const animate = () => {
    const deltatime = clock.getDelta()
   
    mixers?.update(deltatime)
    mixers1?.update(deltatime)
    mixers2?.update(deltatime)
    renderer.render(scene,camera)
}

renderer.setAnimationLoop(animate)

window.addEventListener('resize',()=>{
    camera.aspect = window.innerWidth/window.innerHeight
    camera.updateProjectionMatrix()
    renderer.setSize(window.innerWidth,window.innerHeight)
})
onMounted(()=>{
    document.querySelector('#dd')?.appendChild(renderer.domElement)
})

</script>