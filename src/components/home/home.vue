<template>
<div class="main">
<div class="header">
<headwq><template #center><el-input v-model="searchName" placeholder="搜索"/><el-button type="danger" @click="searchContent" round>搜索</el-button></template>
</headwq>
</div>
<div class="enter">
<div class="aside"><home-toolbar></home-toolbar></div>
<el-scrollbar  @end-reached="loadMore" class="scrollbar">
<div v-for="item in num" :key="item.id" class="content" @click="displayContent(item)">
    <div class="up">
    <div class="frist">
    <el-avatar :src="item.image" />
    <el-text size="large" style="margin-left: 1vw;">{{ item.username }}</el-text>
    </div>
    <el-text size="large" style="margin-left: 1vw;margin-top: 1vh;">{{ item.driftName }}</el-text>
    <el-text size="large"><el-button type="warning" :icon="Star" circle style="margin-top: 1vh;" />{{ item.likeCount }}</el-text>
    </div>
   
   <div class="imageDiv">
   <el-image :src="item.contentimage" :scale="40" style="height:inherit;width: inherit;" />
   </div>
</div>
</el-scrollbar>
</div>
</div>
</template>
<script setup>
import { onMounted } from 'vue'
import { ElMessage } from 'element-plus'
import homeToolbar from './homeToolbar.vue'
import { Star } from '@element-plus/icons-vue'
import { useRouter } from 'vue-router'
import { ref } from 'vue'
 import {userheaders} from '../../store/urlStore'
    import { storeToRefs } from 'pinia'
import headwq from '../nav/headwq.vue'
const searchName=ref('')
const router = useRouter();
const header = userheaders();
const { token } = storeToRefs(header);

// 下面的是我定义的俩个分页参数
const page = ref(1);
const count = ref(7);
const num=ref([]);
// 下面是我进行无线回滚的方法，在后端我使用的是spring mybatis plus 的分页插件来进行分页
async function loadMore(){
  const pages = { page: page.value, count: count.value }
    const response = await fetch('http://localhost:8080/getAlltent', {
    method: 'Post',
    headers: { 
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token.value}` },
        body: JSON.stringify(
        pages
          )
})
    if(response.ok){
        const data = await response.json();
        if(data.length>0){
            data.forEach(item => {
                num.value.push(item);
                console.log(item);
            });
            page.value+=1;
        }
    }
}
async function searchContent(){
    const response = await fetch('http://localhost:8080/searchContent', {
    method: 'Post',
    headers: { 
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token.value}` },
        body: JSON.stringify(
        {searchName: searchName.value }
          )
})
    if(response.ok){        
        const data = await response.json();
        num.value=[];
        data.forEach(item => {
            
            num.value.push(item);
            console.log(item);
        });
    }
}
function displayContent(data){
    header.$patch((state)=>{
        state.content=data.content
        state.driftName=data.driftName
    })
    router.push('/display')
}
// 在页面挂载时先进行加载
onMounted(async()=>{
    loadMore();
})
</script>
<style scoped>
    .main{
        display: flex;
        height: 100vh;
        width: 100vw;
        flex-direction: column;

    }
    .header{
        display: flex;
        width:100vw;
        height:10vh;
        position: fixed;
        top:0;
        left:0;
        justify-content: space-between;
    }
    .enter{
        margin-top:10vh;
        width: 100vw;
        height:90vh; 
        display: flex;
    
    }
    .aside{
        width:20vw;
        height:90vh;
       
    }
    .content{
        width: 100%;
        height: 15vh;
        border-bottom: 1px solid #ccc;
        border-top: 1px solid #ccc;
        display: flex;
        justify-content: space-between;
       
    }
    .imageDiv{
        width:15vw;
        height:14vh;
    }
    .frist{
        display: flex;
        align-items: center;
        justify-content: top;
    }
    .up{
        display: flex;
        flex-direction: column;
        justify-content:top;
       
    }
    .scrollbar{
        width:77vw;
        height:90vh;
        margin-left: 3vw;
    }
</style>