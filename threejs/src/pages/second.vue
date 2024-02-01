<template>
    <div id="container1">
        
    </div>
</template>
<script lang="ts" setup>
import {onMounted} from 'vue'
import * as THREE from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls'; 
import starsTexture from '@/assets/stars.jpg'
import sunTexture from '@/assets/sun.jpg'
import mercuryTexture from '@/assets/mercury.jpg'
import venusTexture from '@/assets/venusmap.jpg'
import earthTexture from '@/assets/earthmap1k.jpg'
import marsTexture from '@/assets/mars_1k_color.jpg'
import jupiterTexture from '@/assets/jupitermap.jpg'
import saturnTexture from '@/assets/saturn.jpg'
import saturnRingTexture from '@/assets/saturn ring.png'
import uranusTexture from '@/assets/uranusmap.jpg'
import uranusRingTexture from '@/assets/uranusringcolor.jpg'
import neptuneTexture from '@/assets/neptunemap.jpg'
import plutoTexture from '@/assets/plutomap1k.jpg'

const sence = new THREE.Scene()
const renderer = new THREE.WebGLRenderer()
renderer.setSize(window.innerWidth,window.innerHeight)
const camare = new THREE.PerspectiveCamera(70,window.innerWidth/window.innerHeight,0.1,10000)
camare.position.set(-90,140,140)

const controls = new OrbitControls(camare,renderer.domElement)
controls.update()
const ambientLight = new THREE.AmbientLight(0x333333)
sence.add(ambientLight)
ambientLight.intensity = 0.75

const cubeTextureLoader = new THREE.CubeTextureLoader()
sence.background = cubeTextureLoader.load([
    starsTexture,
    starsTexture,
    starsTexture,
    starsTexture,
    starsTexture,
    starsTexture,
])

const textureLoader = new THREE.TextureLoader()



const sunGeo = new THREE.SphereGeometry(16,30,30)
const sunMat = new THREE.MeshBasicMaterial({
    map:textureLoader.load(sunTexture)
})
const sun = new THREE.Mesh(sunGeo,sunMat)
sence.add(sun)

const createPlanete = (size,texture,position,ring=null) => {
    const geo = new THREE.SphereGeometry(size,30,30)
    const mat = new THREE.MeshStandardMaterial({
        map:textureLoader.load(texture)
    })
    const mesh = new THREE.Mesh(geo,mat)
    // sun.add(mercury)
    const obj = new THREE.Object3D()
    if(ring){
        const ringGeo = new THREE.RingGeometry(ring.innerRadius,ring.outerRadius ,32)
        const ringMat = new  THREE.MeshBasicMaterial({
            map:textureLoader.load(ring.texture),
            side:THREE.DoubleSide
        })
        const ringMesh = new THREE.Mesh(ringGeo,ringMat)
        obj.add(ringMesh)
        ringMesh.position.x = position
        ringMesh.rotation.x = -0.5 * Math.PI
    }
    obj.add(mesh)
    sence.add(obj)
    mesh.position.x = position
    return {mesh,obj}
}

const mercury = createPlanete(3.2,mercuryTexture,28)
const saturn = createPlanete(10,saturnTexture,138,{innerRadius:10,outerRadius:20,texture:saturnRingTexture})
const venus = createPlanete(5.8,venusTexture,44)
const earth = createPlanete(6,earthTexture,62)
const mars = createPlanete(4,marsTexture,78)
const jupiter = createPlanete(12,jupiterTexture,100)
const uranus = createPlanete(7,uranusTexture,176,{innerRadius:7,outerRadius:12,texture:uranusRingTexture})
const neptune = createPlanete(7,neptuneTexture,200)
const pluto = createPlanete(2.8,plutoTexture,216)

const pointLight = new THREE.PointLight(0xffffff,20000,30000)
sence.add(pointLight)

function animate () {
    sun.rotateY(0.004)
    mercury.mesh.rotateY(0.004)
    mercury.obj.rotateY(0.004)
    saturn.mesh.rotateY(0.038)
    saturn.obj.rotateY(0.0009)
    venus.mesh.rotateY(0.002)
    venus.obj.rotateY(0.015)
    earth.mesh.rotateY(0.02)
    earth.obj.rotateY(0.01)
    mars.mesh.rotateY(0.018)
    mars.obj.rotateY(0.008)
    jupiter.mesh.rotateY(0.04)
    jupiter.obj.rotateY(0.002)
    uranus.mesh.rotateY(0.03)
    uranus.obj.rotateY(0.0004)
    neptune.mesh.rotateY(0.032)
    neptune.obj.rotateY(0.0001)
    pluto.mesh.rotateY(0.008)
    pluto.obj.rotateY(0.00007)
    renderer.render(sence,camare)
}

renderer.setAnimationLoop(animate)

window.addEventListener('resize',(ev)=>{
    camare.aspect = window.innerWidth/window.innerHeight
    camare.updateProjectionMatrix()
    renderer.setSize(window.innerWidth,window.innerHeight)
})

onMounted(() => {
    document.querySelector('#container1')?.appendChild(renderer.domElement)
})


</script>