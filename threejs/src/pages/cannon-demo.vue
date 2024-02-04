<template>
    <div id="cannon">
        
    </div>
</template>
<script lang="ts" setup>
import {onMounted} from 'vue'
import * as THREE from 'three'
import {GLTFLoader} from 'three/examples/jsm/loaders/GLTFLoader.js'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls'; 
import * as CANNON from 'cannon-es'
const renderer = new THREE.WebGLRenderer()
renderer.setSize(window.innerWidth,window.innerHeight)
const sence = new THREE.Scene()
const camare = new THREE.PerspectiveCamera(70,window.innerWidth/window.innerHeight,0.1,10000)
const controls = new OrbitControls(camare,renderer.domElement)
camare.position.set(0,30,30) 
controls.update()

const world = new CANNON.World({
    gravity: new CANNON.Vec3(0,-9.81,0)
})
const timeStep = 1/60


const groundGeo = new THREE.PlaneGeometry(30,30)
const groundMat = new THREE.MeshBasicMaterial({
    wireframe:true,
    color:0xffffff,
    side:THREE.DoubleSide
})

const groundMesh = new THREE.Mesh(groundGeo,groundMat)
sence.add(groundMesh)


const groundPhysMat = new CANNON.Material()
const groundBody = new CANNON.Body({
    // shape: new CANNON.Plane(),
    shape: new CANNON.Box(new CANNON.Vec3(15,15,0.1)),
    // mass: 10
    type: CANNON.Body.STATIC,
    material:groundPhysMat
})

groundBody.quaternion.setFromEuler(-0.5*Math.PI,0,0)

world.addBody(groundBody)


const boxGeometry = new THREE.BoxGeometry(4,4,4)
const boxMaterial = new THREE.MeshBasicMaterial({
    color:0x0000ff,
    wireframe:true,
})
const boxMesh = new THREE.Mesh(boxGeometry,boxMaterial)
// boxMesh.position.set(0,5,0)
sence.add(boxMesh)

const boxPhysMat = new CANNON.Material()
const boxBody = new CANNON.Body({
    shape: new CANNON.Box(new CANNON.Vec3(2,2,2)),
    mass:10,
    position:new CANNON.Vec3(1,15,0),
    material:boxPhysMat
})

boxBody.angularVelocity.set(0,10,0)
boxBody.angularDamping = 0.31

world.addBody(boxBody)

const groundBoxContactMat = new CANNON.ContactMaterial(groundPhysMat,boxPhysMat,{
    friction:0.04
})
world.addContactMaterial(groundBoxContactMat)


const sphereGeometry = new THREE.SphereGeometry(2)
const sphereMaterial = new THREE.MeshBasicMaterial({
    color:0x0000FF,
    wireframe:true
})
const sphereMesh = new THREE.Mesh(sphereGeometry,sphereMaterial)

sence.add(sphereMesh)

const spherePhysMat = new CANNON.Material()
const sphereBody = new CANNON.Body({
    shape:new CANNON.Sphere(2),
    mass:10,
    position:new CANNON.Vec3(6,8,0),
    material:spherePhysMat
})

sphereBody.linearDamping = 0.31

const groundSphereContactMat = new CANNON.ContactMaterial(groundPhysMat,spherePhysMat,{
    restitution:0.9
})

world.addContactMaterial(groundSphereContactMat)

world.addBody(sphereBody)



const animate = () => {

    world.step(timeStep)
    groundMesh.position.copy(groundBody.position)
    groundMesh.quaternion.copy(groundBody.quaternion)

    boxMesh.position.copy(boxBody.position)
    boxMesh.quaternion.copy(boxBody.quaternion)

    sphereMesh.position.copy(sphereBody.position)
    sphereMesh.quaternion.copy(sphereBody.quaternion)
    renderer.render(sence,camare)
}

renderer.setAnimationLoop(animate)

window.addEventListener('resize',()=>{
    camare.aspect = window.innerWidth/window.innerHeight
    camare.updateProjectionMatrix()
    renderer.setSize(window.innerWidth,window.innerHeight)
})

onMounted(()=>{
    document.querySelector('#cannon')?.appendChild(renderer.domElement)
})

</script>
<style lang="less">
</style>