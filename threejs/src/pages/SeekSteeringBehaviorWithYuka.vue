<template>
    <div id="ww"></div>
</template>
<script lang="ts" setup>
import * as THREE from 'three'
import * as YUKA from 'yuka'
import { OrbitControls, GLTFLoader } from 'three-stdlib';
import { onMounted } from 'vue';
const renderer = new THREE.WebGLRenderer({antialias:true})
renderer.setSize(window.innerWidth,window.innerHeight)
renderer.setClearColor(0xa3a3a3)
const scene = new THREE.Scene()
const camera = new THREE.PerspectiveCamera(40,window.innerWidth/window.innerHeight,0.1,1000)
const controls = new OrbitControls(camera,renderer.domElement)
camera.position.set(0,20,0)
controls.update()
camera.lookAt(scene.position)

const vehicleGeo = new THREE.ConeGeometry(0.1,0.5,8)
vehicleGeo.rotateX(Math.PI*0.5)
const vehicleMat = new THREE.MeshNormalMaterial()
const vehicleMesh = new THREE.Mesh(vehicleGeo,vehicleMat)
vehicleMesh.matrixAutoUpdate = false
scene.add(vehicleMesh)

const entityManager = new YUKA.EntityManager()

//创建要跟随的目标
const targetGeo = new THREE.SphereGeometry(0.1)
const targetMat = new THREE.MeshBasicMaterial()
const targetMesh = new THREE.Mesh(targetGeo,targetMat)
targetMesh.matrixAutoUpdate = false
scene.add(targetMesh)
const target = new YUKA.GameEntity()
target.setRenderComponent(targetMesh,(entity,renderComponet)=>{
    renderComponet.matrix.copy(entity.worldMatrix)
})
entityManager.add(target)

const vehicle = new YUKA.Vehicle()
vehicle.setRenderComponent(vehicleMesh,(entity,renderComponet)=>{
    renderComponet.matrix.copy(entity.worldMatrix)
})
entityManager.add(vehicle)

//要使圆锥跟随目标，搜索行为的参数设置为目标的位置
const seekBehavior = new YUKA.SeekBehavior(target.position)
vehicle.steering.add(seekBehavior)

setInterval(()=>{
 const x=Math.random()*3
 const y=Math.random()*3
 const z=Math.random()*3
 target.position.set(x,y,z)
},2000)

const time = new YUKA.Time()
const animate = () => {
    const delta = time.update().getDelta()
    entityManager.update(delta)
    renderer.render(scene,camera)
}

renderer.setAnimationLoop(animate)

onMounted(()=>{
    document.querySelector('#ww')?.appendChild(renderer.domElement)
})
</script>