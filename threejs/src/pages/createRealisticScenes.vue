<template>
    <div id="space">
        
    </div>
</template>
<script lang="ts" setup>
import { onMounted } from 'vue'
import * as THREE from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';
import { RGBELoader } from 'three-stdlib';

const kitHdr = new URL('../../public/MR_INT-003_Kitchen_Pierre.hdr',import.meta.url)

const renderer = new THREE.WebGLRenderer()
renderer.setSize(window.innerWidth,window.innerHeight)
const scene = new THREE.Scene()
const camare = new THREE.PerspectiveCamera(45,window.innerWidth/window.innerWidth,0.1,10000)
const controls = new OrbitControls(camare,renderer.domElement)
camare.position.set(10,0,7)
controls.update()


renderer.outputColorSpace = THREE.SRGBColorSpace;
renderer.toneMapping = THREE.ACESFilmicToneMapping;
renderer.toneMappingExposure = 1.8

const kitHdrDemo = new RGBELoader()
kitHdrDemo.load(kitHdr.href,(texture)=>{
    texture.mapping = THREE.EquirectangularReflectionMapping
    scene.background = texture
    // scene.environment = texture

    const sphereGeo = new THREE.SphereGeometry(1,50,50)
    const sphereMat = new THREE.MeshStandardMaterial({
        roughness:0,
        metalness:0.5,
        color:0xffea00,
        envMap:texture
    })
    const sphere = new THREE.Mesh(sphereGeo,sphereMat)
    scene.add(sphere)
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
    document.querySelector('#space')?.appendChild(renderer.domElement)
})

</script>