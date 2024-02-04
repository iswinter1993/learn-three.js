<template>
    <div id="main">
        
    </div>
</template>
<script lang="ts" setup>
import {onMounted} from 'vue'
import * as THREE from 'three'
import {GLTFLoader} from 'three/examples/jsm/loaders/GLTFLoader.js'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls'; 
import vertShader from '../shader/vertexshader.glsl'
import fragShader from '../shader/fragshader.glsl'
import earth from '../assets/earthmap1k.jpg'

const renderer = new THREE.WebGLRenderer()
renderer.setSize(window.innerWidth,window.innerHeight)
const sence = new THREE.Scene()
const camera = new THREE.PerspectiveCamera(70,window.innerWidth/window.innerHeight,0.1,10000)
const controls = new OrbitControls(camera,renderer.domElement)
camera.position.set(0,0,12)
controls.update()

const planeGeometry = new THREE.PlaneGeometry(10,10,30,30)

const uniforms ={ 
            iTime:{ type:'f',value:0.0 },
            iResolution:{ type:'v2',value:new THREE.Vector2(window.innerWidth,window.innerWidth).multiplyScalar(window.devicePixelRatio)},
            iMouse:{type:'v2',value:new THREE.Vector2(0.0,0.0)},
            image:{type:'t',value:new THREE.TextureLoader().load(earth)}
        }
window.addEventListener('mousemove',(e)=>{
    uniforms.iMouse.value.set(e.screenX/window.innerWidth, 1- e.screenY/innerHeight)
})
const planeMaterial = new THREE.ShaderMaterial({
    vertexShader:vertShader,
    fragmentShader:fragShader,
    wireframe:false,
    uniforms
})

const plane = new THREE.Mesh(planeGeometry,planeMaterial)
sence.add(plane)

const clock = new THREE.Clock()
function animate () {
    uniforms.iTime.value = clock.getElapsedTime()
    renderer.render(sence,camera)
}
renderer.setAnimationLoop(animate)

window.addEventListener('resize',()=>{
    camera.aspect = window.innerWidth/window.innerHeight
    camera.updateProjectionMatrix()
    renderer.setSize(window.innerWidth,window.innerHeight)
})

onMounted(()=>{
    document.querySelector('#main')?.appendChild(renderer.domElement)
})
</script>