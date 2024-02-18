<template>
    <div id="main2">
        
    </div>
</template>
<script setup lang="ts">
import {onMounted} from 'vue'
import * as THREE from 'three'
import {GLTFLoader} from 'three/examples/jsm/loaders/GLTFLoader.js'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls'; 
import { ThreeMFLoader } from 'three-stdlib';
import * as CANNON from 'cannon-es'

const renderer = new THREE.WebGLRenderer({antialias:true})
renderer.setSize(window.innerWidth,window.innerHeight)
renderer.shadowMap.enabled = true

const scene = new THREE.Scene()
const camare = new THREE.PerspectiveCamera(70,window.innerWidth/window.innerHeight,0.1,10000)
const controls = new OrbitControls(camare,renderer.domElement)
camare.position.set(0,20,20)
controls.update()

// const axesHelper = new THREE.AxesHelper(30)
// scene.add(axesHelper)
const ambientLight = new THREE.AmbientLight(0xffffff,0.7)
scene.add(ambientLight)

const directionalLight = new THREE.DirectionalLight(0xffffff,10)
scene.add(directionalLight)
directionalLight.position.set(0,50,0)
directionalLight.castShadow = true
directionalLight.shadow.mapSize.width = 1024
directionalLight.shadow.mapSize.height = 1024
const dLightHelper = new THREE.DirectionalLightHelper(directionalLight)
scene.add(dLightHelper)

directionalLight.shadow.camera.bottom = -15
directionalLight.shadow.camera.left = -15
directionalLight.shadow.camera.top = 15
directionalLight.shadow.camera.right = 15
const dLightShadowHelper = new THREE.CameraHelper(directionalLight.shadow.camera)
scene.add(dLightShadowHelper)


const world = new CANNON.World({
    gravity: new CANNON.Vec3(0,-9.81,0)
})
const timeStep = 1/60

const groundGeo = new THREE.PlaneGeometry(30,30)
const groundMat = new THREE.MeshStandardMaterial({
    color:0xffffff,
    side: THREE.DoubleSide,
})
const groundMesh = new THREE.Mesh(groundGeo,groundMat)
groundMesh.receiveShadow = true
scene.add(groundMesh)

const groundPhysMat = new CANNON.Material()
const groundBody = new CANNON.Body({
    shape: new CANNON.Box(new CANNON.Vec3(15,15,0.001)),
    // mass: 0,
    type: CANNON.Body.STATIC,
    material:groundPhysMat
})
groundBody.quaternion.setFromEuler(-0.5*Math.PI,0,0)
world.addBody(groundBody)




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

const meshs = []
const bodies = []

window.addEventListener('click',(e)=>{
    const sphereGeo = new THREE.SphereGeometry(0.25,30,30)
    const sphereMat = new THREE.MeshStandardMaterial({
        color:Math.random() * 0xffffff,
        metalness:0,
        roughness:0
    })
    const sphereMesh = new THREE.Mesh(sphereGeo,sphereMat)
    sphereMesh.castShadow = true
    scene.add(sphereMesh)
    // sphereMesh.position.copy(intersectionPoint)
    
    const spherePhysMat = new CANNON.Material()
    const sphereBody = new CANNON.Body({
        shape: new CANNON.Sphere(0.25),
        mass:1,
        position: new CANNON.Vec3(intersectionPoint.x,intersectionPoint.y,intersectionPoint.z),
        material:spherePhysMat
    })
    world.addBody(sphereBody)
    
    const groundSphereContactMat = new CANNON.ContactMaterial(groundPhysMat,spherePhysMat,{
        // friction:0.03,
        restitution:0.3
    })
    world.addContactMaterial(groundSphereContactMat)
    meshs.push(sphereMesh)
    bodies.push(sphereBody)
    
})



function animate () {
    world.step(timeStep)
    groundMesh.position.copy(groundBody.position)
    groundMesh.quaternion.copy(groundBody.quaternion)

    for(var i = 0 ; i < meshs.length; i++){
        meshs[i].position.copy(bodies[i].position)
        meshs[i].quaternion.copy(bodies[i].quaternion)
    }

    renderer.render(scene,camare)
}

renderer.setAnimationLoop(animate)

window.addEventListener('resize',()=>{
    camare.aspect = window.innerWidth/window.innerHeight
    camare.updateProjectionMatrix()
    renderer.setSize(window.innerWidth,window.innerHeight)
})

onMounted(()=>{
    document.querySelector('#main2')?.appendChild(renderer.domElement)
})
</script>

<style lang="less"></style>