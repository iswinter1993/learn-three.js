<template>
    <div id="box">
        
    </div>
</template>
<script setup lang="ts">
import * as THREE from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import * as kokomi from "kokomi.js";
import { onMounted } from "vue";
import * as dat from "lil-gui";
import {GLTFLoader} from 'three/examples/jsm/loaders/GLTFLoader.js'
const demo = new URL('../assets/doggo2.glb',import.meta.url)

const renderer = new THREE.WebGLRenderer()
renderer.setSize(window.innerWidth,window.innerHeight)
const scene = new THREE.Scene()
const camare = new THREE.PerspectiveCamera(70,window.innerWidth/window.innerHeight,0.1,10000)
const controls = new OrbitControls(camare,renderer.domElement)
camare.position.set(10,10,10)
controls.update()

const ambientLight = new THREE.AmbientLight(0xffffff,0.8)
scene.add(ambientLight)

const groundGeo = new THREE.PlaneGeometry(30,30)
const groundMat = new THREE.MeshBasicMaterial({
    color:0xffffff,
    side:THREE.DoubleSide
})
const groundMesh = new THREE.Mesh(groundGeo,groundMat)
scene.add(groundMesh)
groundMesh.rotateX(-0.5*Math.PI)


const gridHelper = new THREE.GridHelper(30,30)
scene.add(gridHelper)


let mixer:any;
const assetsLoader = new GLTFLoader()
assetsLoader.load(demo.href,(gltf)=>{
    const model = gltf.scene
    scene.add(model)
    mixer = new THREE.AnimationMixer(model)
    const clips = gltf.animations
    // const clip = THREE.AnimationClip.findByName(clips,'HeadAction')
    // const action = mixer.clipAction(clip)
    // action.play()
    clips.forEach((clip)=>{
        const action = mixer.clipAction(clip)
        action.play()
    })

},undefined,(err)=>{
    console.error(err)
})


const clock = new THREE.Clock()
const animate = () =>{
    mixer?.update(clock.getDelta())
    renderer.render(scene,camare)
}

renderer.setAnimationLoop(animate)

window.addEventListener('resize',(e)=>{
    camare.aspect = window.innerWidth / window.innerHeight
    camare.updateProjectionMatrix()
    renderer.setSize(window.innerWidth,window.innerHeight)
})


onMounted(()=>{
    document.querySelector('#box')?.appendChild(renderer.domElement)
})
</script>
<style lang="less"></style>