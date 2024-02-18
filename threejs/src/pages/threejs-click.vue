<template>
    <div id="main1">
        
    </div>
</template>
<script setup lang="ts">
import {onMounted} from 'vue'
import * as THREE from 'three'
import {GLTFLoader} from 'three/examples/jsm/loaders/GLTFLoader.js'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls'; 
import { ThreeMFLoader } from 'three-stdlib';
const renderer = new THREE.WebGLRenderer()
renderer.setSize(window.innerWidth,window.innerHeight)
const scene = new THREE.Scene()
const camare = new THREE.PerspectiveCamera(70,window.innerWidth/window.innerHeight,0.1,10000)
const controls = new OrbitControls(camare,renderer.domElement)
camare.position.set(0,10,10)
controls.update()

const axesHelper = new THREE.AxesHelper(30)
scene.add(axesHelper)

const directionalLight = new THREE.DirectionalLight(0xffffff,1)
scene.add(directionalLight)

const mouse = new THREE.Vector2()
const intersectionPoint = new THREE.Vector3()
const planeNormal = new THREE.Vector3()
const plane = new THREE.Plane()
const raycaster = new THREE.Raycaster()

window.addEventListener('mousemove',(e)=>{
    mouse.x = (e.clientX / window.innerWidth) * 2 - 1
    mouse.y = 1 - (e.clientY / window.innerHeight) * 2

    planeNormal.copy(camare.position).normalize()
    plane.setFromNormalAndCoplanarPoint(planeNormal,scene.position)

    raycaster.setFromCamera(mouse,camare)
    raycaster.ray.intersectPlane(plane,intersectionPoint)
})


window.addEventListener('click',(e)=>{
    const sphereGeo = new THREE.SphereGeometry(0.125,30,30)
    const sphereMat = new THREE.MeshStandardMaterial({
        color:0xffea00,
        metalness:0,
        roughness:0
    })
    const sphereMesh = new THREE.Mesh(sphereGeo,sphereMat)
    scene.add(sphereMesh)
    sphereMesh.position.copy(intersectionPoint)
    
})



function animate () {
    renderer.render(scene,camare)
}

renderer.setAnimationLoop(animate)

window.addEventListener('resize',()=>{
    camare.aspect = window.innerWidth/window.innerHeight
    camare.updateProjectionMatrix()
    renderer.setSize(window.innerWidth,window.innerHeight)
})

onMounted(()=>{
    document.querySelector('#main1')?.appendChild(renderer.domElement)
})
</script>

<style lang="less"></style>