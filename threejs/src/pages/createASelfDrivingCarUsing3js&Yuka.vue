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
const camera = new THREE.PerspectiveCamera(40,window.innerWidth/window.innerWidth,0.1,1000)
const controls = new OrbitControls(camera,renderer.domElement)
camera.position.set(0,10,15)
controls.update()
camera.lookAt(scene.position)

const ambientLight = new THREE.AmbientLight(0xffffff,2)
scene.add(ambientLight)
const directionalLight = new THREE.DirectionalLight(0xffffff,4)
scene.add(directionalLight)

const vehicle = new YUKA.Vehicle()
vehicle.maxSpeed = 3
const gltfLoader = new GLTFLoader()
gltfLoader.load('../../public/suv/scene.gltf',(gltf)=>{
    const model = gltf.scene
    // model.scale.set(0.002,0.002,0.002)
    scene.add(model)
    model.matrixAutoUpdate = false
    vehicle.scale = new YUKA.Vector3(0.002,0.002,0.002)
    vehicle.setRenderComponent(model,(entity,renderComponet)=>{
        renderComponet.matrix.copy(entity.worldMatrix)
    })
})

// const vehicleGeo = new THREE.ConeGeometry(0.1,0.5,8)
// vehicleGeo.rotateX(Math.PI*0.5)
// const vehicleMat = new THREE.MeshNormalMaterial()
// const vehicleMesh = new THREE.Mesh(vehicleGeo,vehicleMat)
// scene.add(vehicleMesh)
// vehicleMesh.matrixAutoUpdate = false



const path = new YUKA.Path()
path.add(new YUKA.Vector3(-4,0,4))
path.add(new YUKA.Vector3(-6,0,0))
path.add(new YUKA.Vector3(-4,0,-4))
path.add(new YUKA.Vector3(0,0,0))
path.add(new YUKA.Vector3(4,0,-4))
path.add(new YUKA.Vector3(6,0,0))
path.add(new YUKA.Vector3(4,0,4))
path.add(new YUKA.Vector3(0,0,6))
path.loop = true;
const position = []
for(var i=0;i<path._waypoints.length;i++){
    const waypoint = path._waypoints[i]
    position.push(waypoint.x,waypoint.y,waypoint.z)
}
const lineGeo = new THREE.BufferGeometry()
lineGeo.setAttribute('position',new THREE.Float32BufferAttribute(position,3))
const lineMat = new THREE.MeshBasicMaterial({color:0xffffff})
const lines = new THREE.LineLoop(lineGeo,lineMat)
scene.add(lines)

vehicle.position.copy(path.current())
const followPathBehavior = new YUKA.FollowPathBehavior(path,0.5)
vehicle.steering.add(followPathBehavior)

const onPathBehavior = new YUKA.OnPathBehavior(path)
vehicle.steering.add(onPathBehavior)

const entityManager = new YUKA.EntityManager()
entityManager.add(vehicle)

const time = new YUKA.Time()
const animate = () => {
    const delta = time.update().getDelta()
    entityManager.update(delta)
    renderer.render(scene,camera)
}
renderer.setAnimationLoop(animate)

window.addEventListener('resize',()=>{
    camera.aspect = window.innerWidth/window.innerHeight
    camera.updateProjectionMatrix()
    renderer.setSize(window.innerWidth,window.innerHeight)
})

onMounted(()=>{
    document.querySelector('#ww')?.appendChild(renderer.domElement)
})

</script>