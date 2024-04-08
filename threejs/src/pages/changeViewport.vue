<template>
<div id="sss"></div>
</template>
<script setup lang="ts">
import * as THREE from 'three'
import { OrbitControls, GLTFLoader, RGBELoader, SkeletonUtils } from 'three-stdlib';
import gsap from 'gsap'
import { onMounted } from 'vue';
const renderer = new THREE.WebGLRenderer()
renderer.setSize(window.innerWidth,window.innerHeight)
renderer.setClearColor(0xA3A3A3);
const scene = new THREE.Scene()
const camera = new THREE.PerspectiveCamera(45,window.innerWidth/window.innerHeight,0.1,1000)
const controls = new OrbitControls(camera,renderer.domElement)
camera.position.set(-1.7, 0, 8.7);
controls.update()
camera.lookAt(scene.position);
const ambientLight = new THREE.AmbientLight(0xffffff,10)
scene.add(ambientLight)
const gltfLoader = new GLTFLoader()
gltfLoader.load('../../public/the_king_s_hall/scene.gltf',(gltf)=>{
    const model = gltf.scene
    scene.add(model)
})

let position = 0
window.addEventListener('mouseup',()=>{
    switch(position){
        case 0 :
            moveCamera(-1.8,1.6,5)
            rotateCamera(0,0.1,0)
            position=1
            break;
        case 1 :
            moveCamera(2.8,0,3.6)
            rotateCamera(0,-2,0)
            position=2
            break;
        case 2 :
            moveCamera(2.5,-0.9,12.2)
            rotateCamera(0.9,0.6,-0.6)
            position=3
            break;
        case 3:
            moveCamera(-2.7, 0.6, 3.7);
            rotateCamera(0.6, 1.9, -0.6);
            position = 4;
            break;
        case 4:
            moveCamera(-1.7, 0, 8.7);
            rotateCamera(0, 4.7, 0);
            position = 5;
            break;
        case 5:
            moveCamera(0.5, 0.8, 10);
            rotateCamera(0.3, 1.65, -0.3);
            position = 0;
    }
})

const moveCamera = (x,y,z)=>{
    gsap.to(camera.position,{
        x,
        y,
        z,
        duration:3
    })
}

const rotateCamera = (x,y,z) => {
    gsap.to(camera.rotation,{
        x,
        y,
        z,
        duration:3.2
    })
}

const animate = () => {
    renderer.render(scene,camera)
}
renderer.setAnimationLoop(animate)

window.addEventListener('resize',()=>{
    camera.aspect = window.innerWidth/window.innerHeight
    camera.updateProjectionMatrix()
    renderer.setSize(window.innerWidth,window.innerHeight)
})

onMounted(()=>{
    document.querySelector('#sss')?.appendChild(renderer.domElement)
})
</script>