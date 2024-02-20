<template>
    <div id="main4">
        
    </div>
</template>
<script setup lang="ts">
import * as THREE from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import * as kokomi from "kokomi.js";
import { onMounted } from "vue";
import * as dat from "lil-gui";
import {GLTFLoader} from 'three/examples/jsm/loaders/GLTFLoader.js'

const donkey =new URL('../assets/Donkey.gltf',import.meta.url)

const renderer = new THREE.WebGLRenderer({antialias:true})
renderer.setSize(window.innerWidth,window.innerHeight)
const scene = new THREE.Scene()
const camare = new THREE.PerspectiveCamera(70,window.innerWidth/window.innerHeight,0.1,10000)
const controls = new OrbitControls(camare,renderer.domElement)
camare.position.set(10,20,20)
controls.update()



const groundGeo = new THREE.PlaneGeometry(30,30)
const groundMat = new THREE.MeshBasicMaterial({
    side:THREE.DoubleSide
})
const groundMesh = new THREE.Mesh(groundGeo,groundMat)
scene.add(groundMesh)
groundMesh.rotateX(- Math.PI/2)

const gridHelper = new THREE.GridHelper(30,30)
scene.add(gridHelper)

const ambientLight = new THREE.AmbientLight(0xffffff,1)
scene.add(ambientLight)

const directionalLight = new THREE.DirectionalLight(0xffffff,1)
scene.add(directionalLight)




const assetsLoader = new GLTFLoader()

const gui = new dat.GUI()
const option = {
    'Main':0x2f3130,
    'Main light': 0x7c7c7c,
    'Main dark':0x0a0a0a,
    'Hooves':0x0f0b0d,
    'Hair':0x0a0a0a,
    'Muzzle':0x0b0804,
    'Eye dark':0x020202,
    'Eye white':0xbebebe
}

assetsLoader.load(donkey.href,(gltf)=>{
    const model = gltf.scene
    scene.add(model)
    console.log(model.getObjectByName('Cube_1'))
    gui.addColor(option,'Main').onChange((e)=>{
        model.getObjectByName('Cube')?.material.color.setHex(e)
    })
    gui.addColor(option,'Main light').onChange((e)=>{
        model.getObjectByName('Cube_1')?.material.color.setHex(e)
    })
    gui.addColor(option,'Main dark').onChange((e)=>{
        model.getObjectByName('Cube_2')?.material.color.setHex(e)
    })
    gui.addColor(option,'Hooves').onChange((e)=>{
        model.getObjectByName('Cube_3')?.material.color.setHex(e)
    })
    gui.addColor(option,'Hair').onChange((e)=>{
        model.getObjectByName('Cube_4')?.material.color.setHex(e)
    })
    gui.addColor(option,'Muzzle').onChange((e)=>{
        model.getObjectByName('Cube_5')?.material.color.setHex(e)
    })
    gui.addColor(option,'Eye dark').onChange((e)=>{
        model.getObjectByName('Cube_6')?.material.color.setHex(e)
    })
    gui.addColor(option,'Eye white').onChange((e)=>{
        model.getObjectByName('Cube_7')?.material.color.setHex(e)
    })
},undefined,(err)=>{
    console.error(err)
})

const animate = () => {
    renderer.render(scene,camare)
}

renderer.setAnimationLoop(animate)

window.addEventListener('resize',()=>{
    camare.aspect = window.innerWidth/window.innerHeight
    camare.updateProjectionMatrix()
    renderer.setSize(window.innerWidth,window.innerHeight)
})

onMounted(()=>{
    document.querySelector('#main4')?.appendChild(renderer.domElement)
})

</script>

<style lang="less">
    
</style>