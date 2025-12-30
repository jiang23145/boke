<template>
<div class="left">
    <el-image src="\img\标题.jpg" fit="cover" scale="10" style="height:auto;width: 60px;margin-left: 30px;margin-top: 1vh;"/>
   <router-link to="/nav" style="text-decoration: none;"> <el-text size="large" style="margin-top:20px;margin-left:30px;color:#222226">创作中心</el-text></router-link>
</div>
<div class="center">
    <slot name="center"></slot>
</div>
<div class="right" >
    <div v-on:mouseover="change()" @mouseout="likai()">
    <el-avatar :size="40" :src="image" class="image" fit="cover" />
        <div class="xuanting" :style="{ display: show }">
        <el-button type="success" plain size="default" @click="writeoff"><el-icon><Close /></el-icon>退出</el-button>
    </div>
</div> 
     <el-badge :value="12" class="item" style="margin-left: 20px;margin-right:50px;margin-top: 30px;">
    <el-text @click="tofriend">消息</el-text>
    </el-badge>
</div>
</template>
<script setup>
    import {ref} from 'vue'
    import { useRouter } from 'vue-router'
   import {userheaders} from '../../store/urlStore' 
   import { storeToRefs } from 'pinia'
import { ro } from 'element-plus/es/locale/index.mjs';
   const headers = userheaders();
   const {image}=storeToRefs(headers);
   
    const circleUrl=ref('https://cube.elemecdn.com/3/7c/3ea6beec64369c2642b92c6726f1epng.png')
    // 通过display来
    const show = ref('none')
    const router = useRouter();
const change=()=>
        show.value='block'
const likai=()=>show.value='none' 
const tofriend=()=>{
    router.push('/friend')
}
const writeoff=()=>{
   
   localStorage.removeItem('my');
   router.push('/');
}

</script>
<style scoped>
    .right{
        display: flex;
        justify-content: center;
    }
    .image{
        transform:translateY(20px)
    }
    .xuanting{
        position:absolute;
        left:88vw;
        top:60px
    }
    .center{
        width: 50vw;
        margin-top: 20px;
        display: flex;
        align-items: center;
    }

</style>