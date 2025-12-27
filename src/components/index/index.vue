<template>
  <div class="main" >
    <div class="first">
      <div class="first-up">
       <el-image src='/img/微信图片_20251201235143_5602_23.jpg' fit="cover" :lazy="true"></el-image>
      </div>
      <div class="first-down">
       <el-text class="mx-1" type="success" size="large" style="text-shadow: green 10px 10px 2px;">欢迎来到水哥的在线博客</el-text>
      </div>
    </div>
    <div class="second" >
     <input type="text" v-model="username" placeholder="请输入你的名字..."/>
     <input type="password" v-model="password" placeholder="密码..."/>
     <el-button type="success" round @click="handleSubmit()">登陆</el-button>
    </div>
  </div>
</template>
<script setup>
  import {ref} from 'vue'
    import { useRouter } from 'vue-router'
    import {userheaders} from '../../store/urlStore'
    import { storeToRefs } from 'pinia'
  const username=ref('')
  const password=ref('')
  const router = useRouter()
  //拿到 pinia
  const headers= userheaders()
    async function handleSubmit() {
      // 下面这一步很重要
      const user = {
        username: username.value,
        userpassword: password.value,
      }
      const wq = await fetch('http://localhost:8080/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(user)
      });
      if(wq.ok){
      console.log('/login 请求已返回，准备解析 json');
      const data = await wq.json();
      
    if (data.Token!=null) {
      //这里我不使用 localStorage 我使用Pinia
      // localStorage.setItem('token', data.token);
      headers.$patch((state)=>{
        state.islogin=true
        state.name=username.value
        state.token=data.Token
      })
      console.log(headers.token)
      router.push('/nav');
      alert('密码正确通过')
    }
     
  }
}
  
</script>
<style scoped>
.main {
 
  display: flex;
  justify-content: center;  
  align-items: center;      
  height: 100vh;            
  width: 100vw;  
  box-shadow: 2px 2px  5px #2b2525;           
}


.first {
   
    height: 50vh;
  width: 25vw;
  display:flex;
flex-direction:column;
}  
.first-up {
width:25vw;
height:50vh
}   
.first-down {
  display: flex;
width:25vw;
height:50vh;
 justify-content: center;  
  align-items: center; 
} 
/* vh 是视口大小 
 page 的最大为width 1528
 height 828
*/ 
.second {
  border: 2px solid aliceblue;
  height: 50vh;
  width: 25vw;
  display: flex;
  flex-direction: column;
  justify-content: space-around;  
   
}
</style>