<template>
    <div class="header">
   <er/>
    </div>
   <el-row style="margin-top: 10vh;">
    <el-col :span="6" style="position: fixed; top:10vh;left:0;">
    <el-menu :collapse= "open" popper-offset="6" class="el-menu-vertical-demo" defaultdefault-active="0">
       <el-menu-item index="0">
        <template #title>  <el-button type="danger" size="large" round @click="cteatewrite()">
          <el-text size="large"> <el-icon><Plus /></el-icon> 创作</el-text> 
      </el-button>
        </template>
        </el-menu-item>
        <el-menu-item index="1">
        <template #title><router-link to="/home" style="text-decoration: none;"><el-icon><HomeFilled /></el-icon><el-text size="large">首页</el-text></router-link></template>
       </el-menu-item>
        <el-sub-menu index="2">
            <template #title><el-icon><Memo /></el-icon><el-text>管理</el-text></template>
       <el-menu-item index="2.1">
        <template #title><router-link to= '/nav/content' style="text-decoration: none;"><el-text>内容管理</el-text></router-link></template>
       </el-menu-item>
       <el-menu-item index="2.2">
        <template #title><el-text>评论管理</el-text></template>
       </el-menu-item>
       <el-menu-item index="2.3">
        <template #title><el-text>专栏管理</el-text></template>
       </el-menu-item>
       </el-sub-menu>
        <el-sub-menu index="3">
            <template #title><el-icon><OfficeBuilding /></el-icon><el-text>数据</el-text></template>
       <el-menu-item index="3.1">
        <template #title><el-text>作品数据</el-text></template>
       </el-menu-item>
       <el-menu-item index="3.2">
        <template #title><el-text>收益数据</el-text></template>
       </el-menu-item>
       <el-menu-item index="3.3">
        <template #title><el-text>粉丝数据</el-text></template>
       </el-menu-item>
       <el-menu-item index="3.4">
        <template #title><el-text>本周小结</el-text></template>
       </el-menu-item>
       </el-sub-menu>
       <el-menu-item index="4"><router-link to= '/nav/edit' style="text-decoration: none;"><el-text><el-icon><User/></el-icon>用户管理</el-text></router-link></el-menu-item>
        <el-menu-item index="4"><router-link to= '/nav/' style="text-decoration: none;"><el-text><el-icon><PictureFilled /></el-icon>作者照片墙</el-text></router-link></el-menu-item>
    </el-menu>
    
    </el-col>
    <el-col :span="18" :offset="5" >
        <div style="height:90vh;" class="teng">
            <router-view></router-view>
        </div>   
    </el-col>
    </el-row>
    
   
</template>
<script setup>
import {ref} from 'vue'
import er from './headwq.vue'
import { useRouter } from 'vue-router'
const router = useRouter();
const contentheader = contentheaders();
 import {contentheaders} from '../../store/contentStore'
import { storeToRefs } from 'pinia'

// 下面定义我的create 创作事件
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

const open=ref(false)
</script>
<style lang="css" scoped>
    .el-menu-vertical-demo:not(.el-menu--collapse) {
  width: 20vw;
  min-height: 100vh;
}
 /* 下面的是我的head 的部分,我用的是fix 固定定位以及flex布局 */
.header{
    height: 10vh;width:100vw;position: fixed; top: 0; left: 0;z-index: 1000;justify-content: space-between;
        display:flex;

}

</style>