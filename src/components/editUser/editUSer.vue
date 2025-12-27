<template>
    <el-table :data="list" style="width: 80vw">
    <el-table-column prop="id" label="Id" width="180" />
    <el-table-column prop="username" label="姓名" width="180" />
    <el-table-column prop="password" label="密码" />
    <el-table-column  label="头像">
    <template #default="scale">
        <el-avatar :size="40" :src="scale.row.image"  fit="cover" />
    </template>
    </el-table-column> 
    <el-table-column prop="hole" label="角色"/>
    <el-table-column prop="authorize" label="权限"/>
   <el-table-column label="编辑">
    <template #default="scale">
        <el-button @click="Update(scale.row,scale.$index)">修改</el-button>
        <el-button  type="danger" size="default" @click="deleteEvent(scale.row,scale.$index)">删除</el-button>   
    </template>
    </el-table-column>
  </el-table>
  <div :style="{display: shows}">
  <div class="uptatefrom">
      
    <el-text type="success" size="large"> 欢迎修改基本的信息:</el-text>
    <el-upload
    class="avatar-uploader"
    action="http://localhost:8080/avatar"
    :show-file-list="false"
    :disabled="imageup"
    :on-success="handleAvatarSuccess"
    :before-upload="beforeAvatarUpload"
  >
    <img v-if="imageUrl" :src="imageUrl" class="avatar" />
    <el-icon v-else class="avatar-uploader-icon"><Plus /></el-icon>
  </el-upload>
  <el-icon v-if="imageUrl" class="deleteIcon" @click="delIcon"><Delete /></el-icon>
<el-form :model="form"  label-width="5vw" :inline="false">
<el-form-item label="名字">
<el-input v-model="form.username"></el-input>
</el-form-item>
<el-form-item label="密码">
<el-input v-model="form.password"></el-input>
</el-form-item>
<el-form-item label=" 角色" size="normal">
<el-select
        v-model="form.hole" placeholder="please select your role">
        <el-option label="ROLE_admin" value="ROLE_admin" />
        <el-option label="ROLE_group" value="ROLE_group" />
      </el-select>
    </el-form-item>
<el-form-item>
<el-button type="primary" @click="onSubmit">立即修改</el-button>
<el-button @click="cancel">取消</el-button>
</el-form-item>
</el-form>
</div>
</div>
</template>
<script setup>
    import {ref,onMounted,reactive} from 'vue'
    import { useRouter } from 'vue-router'
    import { ElMessage } from 'element-plus'
    import {userheaders} from '../../store/urlStore'
    import { storeToRefs } from 'pinia'
    const router = useRouter()
    const imageup=ref(false)
    const imageUrl=ref('')
    const headers = userheaders();
    const { token } = storeToRefs(headers);
    // 定义数据
    const list = ref([])
    // 定义我的div 的show的响应式数据
    const shows = ref('none')
    //下面定义我的修改事件
    function Update(data,index){
        shows.value="block"
        console.log(data);
        form.hole=data.hole
        form.username=data.username
        form.password=data.password
        form.id=data.id
        imageUrl.value=data.image

    }
    // 下面我来定义我的删除事件
    async function deleteEvent(data,index){
       
        const response = await fetch('http://localhost:8080/deldata', {
    method: 'Post',
    headers: { 
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token.value}` },
    body: JSON.stringify({ 
        id: data.id
      })
});
    if(response.ok){
    const data = await response.json()
        alert(data);
    }

    }
    // 下面我来定义我的取消事件
    const cancel=()=>{
        shows.value='none'
    }

    // 请求全部的
    async function getList(){
    console.log(token.value)
const wq = await fetch('http://localhost:8080/list', {
    method: 'Get',
    headers: { 
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token.value}` },
});
 if(wq.ok){
      console.log('/list 请求已返回，准备解析 json');
      const data = await wq.json();
    list.value = data
    console.log(list);
}
    }
// 下面我来定义我的表单的数据
const form = reactive({hole:'',username:'',password:'',id:null})

// 下面定义我的表单提交事件
async function onSubmit(){
    console.log(form.hole);
    const response = await fetch('http://localhost:8080/update', {
    method: 'Post',
    headers: { 
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token.value}` },
    body: JSON.stringify({ 
        id: form.id,
      username: form.username,
      password: form.password,
      hole: form.hole,
      image: imageUrl.value
      })
    })
    if(response.ok){
    const data = await response.json()
    if(data){
        ElMessage("修改成功");
        router.replace("/nav")
    }
  }
}


const handleAvatarSuccess = async (response, uploadFile, uploadFiles)=>{

 setTimeout(()=>imageUrl.value=response.url,3000)
 console.log(uploadFile)
 imageup.value=true
ElMessage("文件上传成功")
}
async function delavatar(){
  if(imageUrl.value!=''){
   const fileName= imageUrl.value.split('/').pop();
  const response = await fetch('http://localhost:8080/delavatar',{
    method:'Post',
    headers:{'Content-Type': 'application/json'},
    body: JSON.stringify({"fileName":fileName})
  })
  const data = await response.json()
  if(data){
    imageUrl.value=''
    imageup.value=false
   ElMessage("删除成功");
  }else{
    ElMessage("删除失败");
  }
  }
}
const delIcon=()=>{
delavatar()}
onMounted(()=>getList())
</script>
<style scoped>
    .uptatefrom{
        position:absolute;
        height:60vh;
        width:40vw;
        top:10vh;
        z-index:1000;
        left:40vw;
        display: flex;
        flex-direction: column;
       box-shadow: 4px 2px 6px #af9f9f;
       justify-content: center;
       background-color: aqua;
       align-items: center;
    }
   .avatar-uploader {
  width: 150px;  /* 设置宽度 */
  height: 150px; /* 设置高度 */
  border: 1px dashed #d9d9d9;
  border-radius: 6px;
  cursor: pointer;
  position: relative;
  overflow: hidden;
   display: flex;
  justify-content: center;
  align-items: center;
  transition: var(--el-transition-duration-fast);
}
.avatar-uploader-icon {
  font-size: 28px;
  color: #8c939d;
  width: 100%;
  height: 100%;
 
}
.avatar-uploader:hover {
  border-color: var(--el-color-primary);
}

/* 设置图片大小与容器一致 */
.avatar-uploader .avatar {
  width: 100%;
  height: 100%;
  object-fit: cover; /* 保持图片比例 */
}
.deleteIcon{
  position:absolute;
  left:25vw;
  top:9vh;
  z-index: 4000;
}
</style>