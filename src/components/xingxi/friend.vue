<template>
<div class="center">
    <div class="header">
        <headwq></headwq>
    </div>
    <div class="main">
    <h4 style="margin-top: 2vh;margin-left: 1vw;margin-bottom: 3vh;">消息中心</h4>
        <div class="content">
           
        <el-table :data="friends" style="width:10vw;margin-left: 20px; height:68vh" @row-click="handleClick" :border="true">
            <el-table-column prop="username">
            <template #header>
                 <el-avatar :size="40" :src="image"  fit="cover" />
                 <el-Text size="large">{{ name }}</el-Text>
            </template> 
            <template #default="scale">
                <el-avatar :size="40" :src="scale.row.image"  fit="cover" />
                <el-Text size="large">{{ scale.row.username }}</el-Text>
          
            </template>   
            </el-table-column>    
        </el-table>
       
        <div class="right">
          <RouterView></RouterView>
        </div>
        </div>
    </div>
    </div>
</template>
<script setup>
  import headwq from '../nav/headwq.vue'
import {userheaders} from '../../store/urlStore'
import { storeToRefs } from 'pinia'
import {ref,onMounted,onUnmounted} from 'vue'
import { Client } from '@stomp/stompjs'
import SockJS from 'sockjs-client'
 import { useRouter} from 'vue-router'
 const router=useRouter();
const friends=ref([])
const headers = userheaders();
const { token,name,image,messages} = storeToRefs(headers);
async function getList(){
    console.log(token.value)
const wq = await fetch('http://localhost:8080/friend/get', {
    method: 'Get',
    headers: { 
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token.value}` },
});
 if(wq.ok){
      console.log('/friend 请求已返回，准备解析 json');
      const data = await wq.json();
    friends.value=data
    console.log(data)
}
}


// 下面进行webScoket 连接
const client = ref(null)
const connected = ref(false)
// 下面我进行我的row-click 点击事件
function handleClick(row){
  console.log(row)
  headers.$patch((state)=>{
    state.connect=client.value
  })
  router.push({name:'chat',params:{name:row.username}})
}
//const messages = ref('')
const connect = () => {
  // 创建 STOMP 客户端，使用 SockJS
  client.value = new Client({
    // 关键：使用 webSocketFactory 而不是 brokerURL
    webSocketFactory: () => {
      // Spring Boot 后端使用 SockJS，所以前端也必须用 SockJS
      return new SockJS('http://localhost:8080/ws')
    },
    
    connectHeaders: {
      // 如果有认证需求
      Authorization: `Bearer ${token.value}`
    },
    
    debug: (str) => {
      console.log('STOMP:', str)
    },
    
    reconnectDelay: 5000,
    
    onConnect: (frame) => {
      console.log('连接成功')
      connected.value = true
      
      // 订阅消息
      client.value.subscribe('/topic/messages', (message) => {
        console.log('收到消息:', message.body)
      
       
      })
      
      client.value.subscribe('/topic/greetings', (message) => {
        console.log('收到问候:', message.body)
       
      })
      client.value.subscribe('/user/queue/message',(message)=>{
        console.log('收到私信:', message.body)
        console.log(typeof(message.body))
        const messageData=JSON.parse(message.body)
        console.log(typeof(messageData))
  //        headers.$patch((state)=>{
  //         console.log(state.messages)
  //       state.messages.value=[messageData.message]
  // })
    messages.value.push(messageData.message)
        
      })
      
    },
    
    onStompError: (frame) => {
      console.error('STOMP 错误:', frame)
    },
    
    onWebSocketError: (event) => {
      console.error('WebSocket 错误:', event)
    },
    
    onDisconnect: () => {
      console.log('连接断开')
      connected.value = false
    }
  })
client.value.activate()
}
onMounted(()=>{getList()
  connect()
})

onUnmounted(() => {
  if (client.value) {
    client.value.deactivate()
  }
})
</script>
<style scoped>
    .center{
       flex-direction: column;
        width:100vw;
        height:90vh;
        display: flex;
        
        align-items: center;
       
    }
    .main{
        display: flex;
        height:80vh;
        width: 80vw;
        margin-top: 10vh;
        box-shadow: var(--el-border-color-light) 0px 0px 10px;
        flex-direction: column;
    }
    .content{
        display: flex;
        justify-content: flex-start;
    }
    .right{
        height:68vh;
        width:70vw;
       
       border-top-style: groove;
       border-top-width: 1px;
    }
    .header{
    height: 10vh;width:100vw;position: fixed; top: 0; left: 0;z-index: 1000;justify-content: space-between;
        display:flex;margin-bottom: 10vh;

}
</style>