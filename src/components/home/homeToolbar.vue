<template>
    <el-menu :collapse= "open" popper-offset="6" class="el-menu-vertical-demo" defaultdefault-active="0">
       <el-menu-item index="0">
        <template #title>  <el-button type="danger" size="large" round @click="cteatewrite()">
          <el-text size="large"> <el-icon><Plus /></el-icon> 创作</el-text> 
      </el-button>
        </template>
        </el-menu-item>
        <el-menu-item index="1">
        <template #title><div  @click="tohome"><el-icon><HomeFilled /></el-icon><el-text size="large">首页</el-text></div></template>
       </el-menu-item>
      <el-menu-item index="2" ><el-icon><StarFilled /></el-icon><el-text>收藏</el-text></el-menu-item>
      
       <el-menu-item index="4"><router-link to= '/nav/edit' style="text-decoration: none;"><el-text><el-icon><User/></el-icon>用户管理</el-text></router-link></el-menu-item>
        <el-menu-item index="4"><router-link to= '/nav/' style="text-decoration: none;"><el-text><el-icon><PictureFilled /></el-icon>作者照片墙</el-text></router-link></el-menu-item>
    </el-menu>
    

</template>
<script setup>

import { useRouter } from 'vue-router'
const router = useRouter();
const contentheader = contentheaders();
 import {contentheaders} from '../../store/contentStore'
function cteatewrite(){
    localStorage.removeItem('co')
     contentheader.$patch((state)=>{
        state.content=''
        state.contentid=''
        state.contentimage=''
        state.driftName=''
    })
    router.push("/down")

}
function tohome(){
    window.location.reload();
}

</script>