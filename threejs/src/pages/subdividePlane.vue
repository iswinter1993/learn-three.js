<template>
    <div id="main3"></div>
</template>
<script lang="ts" setup>
import {onMounted} from 'vue'
import * as THREE from 'three'
import {GLTFLoader} from 'three/examples/jsm/loaders/GLTFLoader.js'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls'; 
import { ThreeMFLoader } from 'three-stdlib';
import * as CANNON from 'cannon-es'
const renderer = new THREE.WebGLRenderer()
renderer.setSize(window.innerWidth,window.innerHeight)
const scene = new THREE.Scene()
const camare = new THREE.PerspectiveCamera(70,window.innerWidth/window.innerHeight,0.1,10000)
const controls = new OrbitControls(camare,renderer.domElement)
camare.position.set(10,15,-22)
controls.update()

const planeGeometry = new THREE.PlaneGeometry(20,20)
const planeMaterial = new THREE.MeshBasicMaterial({
    side: THREE.DoubleSide,
    color:0xffffff,
    visible:false
})
const planeMesh = new THREE.Mesh(planeGeometry,planeMaterial)
scene.add(planeMesh)
planeMesh.rotateX( - Math.PI / 2)
planeMesh.name = 'ground'

const gridHelper = new THREE.GridHelper(20,20)
scene.add(gridHelper)

const heightlightMesh = new THREE.Mesh(
    new THREE.PlaneGeometry(1,1),
    new THREE.MeshBasicMaterial({
        side:THREE.DoubleSide,
        transparent:true
    })
)
heightlightMesh.rotateX(-Math.PI / 2)
scene.add(heightlightMesh)
heightlightMesh.position.set(0.5,0,0.5)

const mousePosition = new THREE.Vector2()
const raycaster = new THREE.Raycaster()
let intersects

window.addEventListener('mousemove',(e)=>{
    mousePosition.x = (e.clientX / window.innerWidth) * 2 - 1
    mousePosition.y = 1 - (e.clientY / window.innerHeight) * 2
    raycaster.setFromCamera(mousePosition,camare)
    intersects = raycaster.intersectObject(planeMesh)
    // console.log('intersects',intersects)
    if(intersects.length > 0){
        const intersect = intersects[0]
        const heightlightPos = new THREE.Vector3().copy(intersect.point).floor().addScalar(0.5)
        heightlightMesh.position.set(heightlightPos.x,0,heightlightPos.z)
        const objExist = obj.find((v:any)=>{
            return (v.position.x === heightlightMesh.position.x && v.position.z === heightlightMesh.position.z)
        })
        if(objExist){
            heightlightMesh.material.color.setHex(0xff0000)
        }else{
            heightlightMesh.material.color.setHex(0xffffff)
        }

    }
})


const sphereGeo = new THREE.SphereGeometry(0.4,4,2)
const sphereMat = new THREE.MeshBasicMaterial({
    wireframe:true,
    color:0xffea00
})
const sphereMesh = new THREE.Mesh(sphereGeo,sphereMat)
// scene.add(sphereMesh)

const obj:any = []
window.addEventListener('click',(e)=>{
    const objExist = obj.find((v:any)=>{
        return (v.position.x === heightlightMesh.position.x && v.position.z === heightlightMesh.position.z)
    })
    if(objExist) return
    if(intersects.length > 0){
        const sphereClone = sphereMesh.clone()
        sphereClone.position.copy(heightlightMesh.position)
        obj.push(sphereClone)
        scene.add(sphereClone)
        heightlightMesh.material.color.setHex(0xff0000)
    }
    console.log(scene.children.length)
})



function animate (time) {
    heightlightMesh.material.opacity = 1 + Math.sin(time/120)
    obj.forEach(v=>{
        v.rotation.x = time / 1000
        v.rotation.z = time / 1000
        v.position.y = 0.5 + 0.5 * Math.abs(Math.sin(time / 1000))
    })
    renderer.render(scene,camare)
}

renderer.setAnimationLoop(animate)

window.addEventListener('resize',()=>{
    camare.aspect = window.innerWidth/window.innerHeight
    camare.updateProjectionMatrix()
    renderer.setSize(window.innerWidth,window.innerHeight)
})

onMounted(()=>{
    document.querySelector('#main3')?.appendChild(renderer.domElement)
})


</script>
<style lang="less"></style>