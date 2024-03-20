<template>
<div id="qqq"></div>
</template>
<script lang="ts" setup>
import * as THREE from 'three'
import { OrbitControls } from 'three-stdlib';
import { onMounted } from 'vue';
import * as YUKA from 'yuka'

console.log('YUKA',new YUKA.Vehicle())
const renderer = new THREE.WebGLRenderer()
renderer.setSize(window.innerWidth,window.innerHeight)
renderer.setClearColor(0xA3A3A3)
const scene = new THREE.Scene()
const camera = new THREE.PerspectiveCamera(45,window.innerWidth/window.innerHeight,0.1,1000)
const controls = new OrbitControls(camera,renderer.domElement)
camera.position.set(0,20,0)
controls.update()
camera.lookAt(scene.position)
//创建圆锥网格
const vehicleGeo = new THREE.ConeGeometry(0.1,0.5,8)
vehicleGeo.rotateX(Math.PI*0.5)
const vehicleMat = new THREE.MeshNormalMaterial()
const vehicleMesh = new THREE.Mesh(vehicleGeo,vehicleMat)
//网格自动更新设置为false，使用yuka、处理网格动画
vehicleMesh.matrixAutoUpdate = false
scene.add(vehicleMesh)

//创建圆锥实例
const vehicle = new YUKA.Vehicle()
//调用setrender方法组合 网格和 圆锥实例
vehicle.setRenderComponent(vehicleMesh,(entity,renderComponet)=>{
    //把 输入的网格和 圆锥实例 组合起来，进行矩阵位置，方向的计算，使用yuka、处理网格动画
    renderComponet.matrix.copy(entity.worldMatrix)

})
//更改速度
vehicle.maxSpeed = 3;

const path = new YUKA.Path()
path.add(new YUKA.Vector3(-4,0,4))
path.add(new YUKA.Vector3(-6,0,0))
path.add(new YUKA.Vector3(-4,0,-4))
path.add(new YUKA.Vector3(0,0,0))
path.add(new YUKA.Vector3(4,0,-4))
path.add(new YUKA.Vector3(6,0,0))
path.add(new YUKA.Vector3(4,0,4))
path.add(new YUKA.Vector3(0,0,6))

//是否循环
path.loop = true;

//把圆锥实例位置 放在路径当前位置
vehicle.position.copy(path.current())
//创建一个跟随路径的实例,第一个参数是路径，第二个参数是在距离转折点多远的距离变向
const followPathBehavior = new YUKA.FollowPathBehavior(path,0.5)
vehicle.steering.add(followPathBehavior)

//onPath使用更严格的路线跟随,onPath的默认radius是0.1，所以路线跟随更加严格。
const onPathBehavior = new YUKA.OnPathBehavior(path)
onPathBehavior.radius = 0.8
vehicle.steering.add(onPathBehavior)

//创建实体管理器，方便我们改变圆锥的状态
const entityManager = new YUKA.EntityManager()
entityManager.add(vehicle)

//储存path顶点坐标
const position = []
for(var i=0 ; i<path._waypoints.length; i++){
    const waypoint = path._waypoints[i]
    position.push(waypoint.x, waypoint.y, waypoint.z)
}
//使用缓冲区几何，画出路径
const lineGeo = new THREE.BufferGeometry()
//设置32位缓冲区，储存位置数组，3个一组设置几何体
lineGeo.setAttribute('position',new THREE.Float32BufferAttribute(position,3))
//设置材质
const lineMat = new THREE.MeshBasicMaterial({color:0xffffff})
//设置LineLoop,会把最后一个顶点与第一个顶点相连，Line则不会
const lines = new THREE.LineLoop(lineGeo,lineMat)
scene.add(lines)

//创建实体管理器 所需要的时间
const time = new YUKA.Time()
const animate = () =>{
    //把时间传递给 实体管理器
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
    document.querySelector('#qqq')?.appendChild(renderer.domElement)
})
</script>