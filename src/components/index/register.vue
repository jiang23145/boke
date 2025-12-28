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
   <h1 style="margin-bottom: 5vh;">在线博客</h1>
    <el-text size="large" class="text">用户名:</el-text>
     <input class="input" type="text" v-model="username" placeholder="请输入你的名字..."/> 
    <el-text size="large" class="text">密码:</el-text>
     <input class="input" type="password" v-model="password" placeholder="密码..."/>
     <el-button type="success" round @click="handleSubmit()"class="button">注册</el-button>
     <div class="end">
      <div>
      <el-icon><ChromeFilled /></el-icon>
      <el-icon><ElemeFilled /></el-icon>
     </div>
      <router-link to="/" style="text-decoration: none;"><el-text size="large">已有账号</el-text></router-link>
    </div>
    </div>
  </div>
</template>
<script setup>
  import {ref} from 'vue'
    import { useRouter } from 'vue-router'
    import {userheaders} from '../../store/urlStore'
    import { ElMessage } from 'element-plus'
  const username=ref('')
  const password=ref('')
  const router = useRouter()
  //拿到 pinia
  const headers= userheaders()
    async function handleSubmit() {
      // 下面这一步很重要
      const user = {
        username: username.value,
        password: password.value,
      }
      const wq = await fetch('http://localhost:8080/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(user)
      });
      if(wq.ok){
      console.log('/register 请求已返回，准备解析 json');
      const data = await wq.json();
      console.log(data)
        if(data){
          router.push('/');
          ElMessage('注册成功，欢迎')
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
 justify-content: center;
   
}
.text{
  margin-top:20px;
  margin-left:10px;
 
  width: inherit;
}
.input{
  height:35px;
  width:inherit;

  
  border-radius:5px;

}
.button{
  margin-top:30px;
  

}
.end{
  display:flex;
  justify-content: space-between;
 margin-top: 2vh;
 
}
</style>