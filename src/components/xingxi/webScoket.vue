<template>
  <div class="big">
    <div class="user">
   <el-text size="large" class="text">{{ username}}</el-text> 
   
    </div>
    <div class="first">
     <el-scrollbar class="second">
        <div v-for="item in messages.get(username)" :key="item">
          <el-text>{{ item }}</el-text>
        </div>
        </el-scrollbar>
      </div>
      <div class="end">
    <el-input type="textarea" :rows="4" v-model="data" placeholder="这里编辑你的消息" 
    :maxlength="-1" :show-word-limit="false" >
     
    </el-input>
    <el-button @click="sendMessage" class="button" type="danger" round>发送</el-button>
   
    </div>
    </div>

</template>

<script setup>
import { ref, onUnmounted, watch} from 'vue'
import {userheaders} from '../../store/urlStore'
import { storeToRefs } from 'pinia'
 import { useRouter,useRoute} from 'vue-router'
 import dayjs from 'dayjs'
import 'dayjs/locale/zh-cn' 

 const useRoutes = useRoute()
const header = userheaders()
const {token,connect,messages} = storeToRefs(header)
const data = ref('')


const username= ref(useRoutes.params.name)
username.value=useRoutes.params.name
//下面我进行username的监听
watch(()=>useRoutes.params.name,(newVal)=>{
  username.value=newVal
 
})
                                                                                                                                                                                                                                                                                                                                                                            
function sendMessage(){
  const time =ref(dayjs().format('YYYY-MM-DD-HH-mm-ss'))
  // 判断有没有这个用户
  if(!header.messages.has(username.value)){
          header.messages.set(username.value,[])
        }
  header.messages.get(username.value).push(data.value)
  console.log(typeof time)
  console.log(time)
  const times = time.value
  const message= data.value
connect.value.publish({
      destination: '/app/chat',  
      body: JSON.stringify({"toUser":username.value,"message":message,"time":times})
    })}
</script>
<style>
  .text{
    position:relative;
    left:1vw;
  }
  .big{
    display: flex;
    height:inherit;
    width: inherit;
    flex-direction: column;
  }
  .user{
    width: inherit;
    height:6vh;
    display: flex;
    justify-content: space-between;
    align-items: center;
  }
  .first{
    display: flex;
    height: 62vh;
    width: inherit;
    flex-direction: column;
    border-top-style: groove;
       border-top-width: 1px;
  }
  .second{
    height:45vh;
    width:inherit;

    
  }
  .button{
    position: relative;
    bottom:5vh;
    left:65vw;
  }
</style>