<template>
    <div id="qq"></div>
</template>
<script lang="ts" setup>
import * as THREE from 'three'
import * as YUKA from 'yuka'
import { OrbitControls,GLTFLoader } from 'three-stdlib';
import { onMounted } from 'vue';
const renderer = new THREE.WebGLRenderer({antialias:true})
renderer.setSize(window.innerWidth,window.innerHeight)
const scene = new THREE.Scene()
const camera = new THREE.PerspectiveCamera(45,window.innerWidth/window.innerHeight,0.1,1000)
const controls = new OrbitControls(camera,renderer.domElement)
camera.position.set(10,10,0)
controls.update()
camera.lookAt(scene.position)

renderer.setClearColor(0xa3a3a3)

const ambientLight = new THREE.AmbientLight(0xffffff,5)
scene.add(ambientLight)

// const gridHelper = new THREE.GridHelper(30,30)
// scene.add(gridHelper)



const mousePosition = new THREE.Vector2()
window.addEventListener('mousemove',(e)=>{
    mousePosition.x = (e.clientX / window.innerWidth) * 2 - 1
    mousePosition.y = 1 - (e.clientY / window.innerHeight) * 2 
    
})


const rayCaster = new THREE.Raycaster()
window.addEventListener('click',()=>{
    rayCaster.setFromCamera(mousePosition,camera)
    const intersectionPoint = rayCaster.intersectObject(planeMesh)
    console.log(mousePosition,intersectionPoint)
    if(intersectionPoint.length>0){
        target.position.set(intersectionPoint[0].point.x,0,intersectionPoint[0].point.z)
    }
})


const planeGeo = new THREE.PlaneGeometry(30,30)
const planeMat = new THREE.MeshBasicMaterial({visible:false,side:THREE.DoubleSide})
const planeMesh = new THREE.Mesh(planeGeo,planeMat)
planeMesh.rotation.x = -0.5 * Math.PI
scene.add(planeMesh)
planeMesh.name = 'planeMesh'


const vehicleGeo = new THREE.ConeGeometry(0.1,0.5,8)
vehicleGeo.rotateX(Math.PI*0.5)
const vehicleMat = new THREE.MeshNormalMaterial()
const vehicleMesh = new THREE.Mesh(vehicleGeo,vehicleMat)
vehicleMesh.matrixAutoUpdate = false
scene.add(vehicleMesh)



const targetGeo = new THREE.SphereGeometry(0.1)
const targetMat = new THREE.MeshBasicMaterial()
const targetMesh = new THREE.Mesh(targetGeo,targetMat)
targetMesh.matrixAutoUpdate = false
scene.add(targetMesh)




const entityManager = new YUKA.EntityManager()
const vehicle = new YUKA.Vehicle()
const target = new YUKA.GameEntity()
const modelVehicle = new YUKA.Vehicle()
modelVehicle.scale.set(0.15,0.15,0.15)

vehicle.setRenderComponent(vehicleMesh,(entity,renderComponet)=>{
    renderComponet.matrix.copy(entity.worldMatrix)
})

const gltfLoader = new GLTFLoader()
const group = new THREE.Group()
gltfLoader.load('../../public/Striker/Striker/glTF/Striker.gltf',(gltf)=>{
    const model = gltf.scene
    model.matrixAutoUpdate = false
    modelVehicle.setRenderComponent(model,(entity,renderComponet)=>{
        renderComponet.matrix.copy(entity.worldMatrix)
    })
    entityManager.add(modelVehicle)
    group.add(model)
    scene.add(group)
})

// setInterval(()=>{
//     const x = Math.random()*3
//     const y = Math.random()*3
//     const z = Math.random()*3
//     target.position.set(x,y,z)
// },2000)

entityManager.add(vehicle)
// target.setRenderComponent(targetMesh,(entity,renderComponet)=>{
//     renderComponet.matrix.copy(entity.worldMatrix)
// })
entityManager.add(target)
vehicle.maxSpeed = 3
const arriveBeHavior = new YUKA.ArriveBehavior(target.position,2,0.5)
vehicle.steering.add(arriveBeHavior)
vehicle.position.set(-3,0,-3)

modelVehicle.steering.add(arriveBeHavior)
modelVehicle.position.set(3,0,3)

const time = new YUKA.Time()
const animation = (t) => {
    const delta = time.update().getDelta()
    group.position.y = 0.5 * Math.sin(t/500)
    entityManager.update(delta)
    renderer.render(scene,camera)
}
renderer.setAnimationLoop(animation)
window.addEventListener('resize',()=>{
    camera.aspect=window.innerWidth/window.innerHeight
    camera.updateProjectionMatrix()
    renderer.setSize(window.innerWidth,window.innerHeight)
})

onMounted(()=>{
    document.querySelector('#qq')?.appendChild(renderer.domElement)
})
</script>