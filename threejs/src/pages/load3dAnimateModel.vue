<template>
    <div id="box">
        
    </div>
</template>
<script setup lang="ts">
import * as THREE from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import * as kokomi from "kokomi.js";
import { onMounted } from "vue";
import * as dat from "lil-gui";
import img from '@/assets/1705285132436.jpg'
import img2 from '@/assets/RzwqhImAV9H57xs.jpg'
import {GLTFLoader} from 'three/examples/jsm/loaders/GLTFLoader.js'
const demo = new URL('../assets/doggo.glb',import.meta.url)
const assetsLoader = new GLTFLoader()
assetsLoader.load(demo.href,(gltf)=>{
    
})
</script>
<style lang="less"></style>