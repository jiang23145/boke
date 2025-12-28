<template>
     <el-table v-if="contentList.length>0" :data="contentList" style="width: 80vw" height="90vh" empty-text>
        <el-table-column fixed  label="文章" width="500px">
            <template #default="scale">
                <div class="title">
                 <div style="background-color: aliceblue; height:8vh;width:10vw" @click="pushcontent(scale.row)">
                <el-image :src="scale.row.contentimage" :scale="40" style="height:inherit;width: inherit;"/>
                </div>
                <div class="drift">
                    <el-Text size="large" type="primary">{{ scale.row.driftName }}</el-Text>
                    <el-Text >{{ scale.row.time }}</el-Text>
                </div>
                </div>
            </template>
        </el-table-column >
        <el-table-column label="展现">
        </el-table-column>
         <el-table-column prop="likeCount"label="点赞">
        </el-table-column>
         <el-table-column label="评论">
        </el-table-column>
         <el-table-column label="操作">
        <template #default="scale">
        <el-button @click="Update(scale.row,scale.$index)">修改</el-button>
        <el-button  type="danger" size="default" @click="deleteEvent(scale.row,scale.$index)">删除</el-button>   
        </template>
        </el-table-column>
        </el-table>
</template>
<script setup>
import {userheaders} from '../../store/urlStore'
import { contentheaders } from '../../store/contentStore'
import { storeToRefs } from 'pinia'
import {ref,onMounted} from 'vue'
import { useRouter } from 'vue-router'
const headers = userheaders();
const contentheader = contentheaders();
const { token } = storeToRefs(headers);
const router = useRouter()
const contentList= ref([]); 
// 下面的请求我的所有的内容
async function GainContent(){
        const response = await fetch('http://localhost:8080/getContent', {
    method: 'Get',
    headers: { 
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token.value}` }
    })
    if(response.ok){
        const data = await response.json();
        console.log(data)
        contentList.value=data
        console.log(contentList.value)
    }
}
// 定义图片被点击的事件,我这里是把我的content 传输出去然后在进行markdown 的解析
 function pushcontent(data){
    if(data.content!=null){
        console.log("开始pinina content")
     headers.$patch((state)=>{
        state.content=data.content
        state.driftName=data.driftName
        console.log(data.content)
    })
    router.push('/display')
    
}
 }
function Update(data,index){
    contentheader.$patch((state)=>{
        state.content=data.content;
        state.contentid=data.contentid;
        state.contentimage=data.contentimage;
        state.driftName=data.driftName;
    })
    console.log(data.contentid)
    router.push('/down')
}
   
    

// 在挂载的时候去调用我的 GainContent
onMounted(()=>GainContent())
</script>
<style scoped>
 .title{
    display:flex;

 }
 .drift{
    display:flex;
    flex-direction: column;
    justify-content: space-between;
    align-items:flex-start;
    margin-left: 20px;
 }


</style>