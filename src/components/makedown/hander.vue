<template>
<nav class="navbar navbar-expand-lg navbar-light bg-light">
  
    <a class="navbar-brand" href="#">水哥在线博客</a>
    <button class="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarNav" aria-controls="navbarNav" aria-expanded="false" aria-label="Toggle navigation">
      <span class="navbar-toggler-icon"></span>
    </button>
    <div class="collapse navbar-collapse" id="navbarNav">
      <input class="form-control me-2" type="text" placeholder="标题" aria-label="Search" v-model="searchname">
      <ul class="navbar-nav ms-auto"> 
        <li class="nav-item">
          <RouterLink to="/nav" class="nav-link active" aria-current="page">Home</RouterLink>
        </li>
        <li class="nav-item">
          <RouterLink to="/nav" class="nav-link" style="margin-right: 10px;">创作中心</RouterLink>
        </li>
        
      </ul>
    
  </div>
</nav> 

<mavon-editor :style="{'height':'700px'}"
    ref='md'
    :toolbar="toolbars" 
    v-model="editValue" 
    @save="save" 
    @imgAdd="handleImgAdd"
    @imgDel="handleImgDel"
    :ishljs="true" 
    placeholder="开始进行编写"
    :subfield="false"
    :preview="true"
    defaultOpen="edit"
    :boxShadow="false"
  />

  <div class="buttondiv">
 
    <el-button type="success" plain @click="saveDraft">保存草稿</el-button>
    <el-button type="danger"  @click="publishImage">发布文档</el-button>
</div>
<div class="ContentPicture" :style="{display:shows}">
  <el-Text size="large" tag="b">发布文章:</el-Text>
  <el-Text size="large" class="fengmian">添加封面</el-Text>
  <el-button  @click="xugai" class="cancel" :icon="CloseBold" circle />
 <el-upload
    class="avatar-uploader"
    action="http://localhost:8080/saveCover"
    :disabled="imageUp"
    :show-file-list="false"
    :on-success="handleAvatarSuccess"
    
  >
    <img v-if="ContentImage" :src="ContentImage" class="avatar" />
    <el-icon v-else class="avatar-uploader-icon" ><Plus /></el-icon>
  </el-upload>
  <el-icon v-if="ContentImage" class="deleteIcon" @click="delIcon"><Delete /></el-icon>
  <el-button class="fangbu" type="danger"  @click="publish">发布文档</el-button>
  </div>
</template>
<script setup>
  import { useRouter } from 'vue-router'
import { ElMessage } from 'element-plus'
import {CloseBold} from '@element-plus/icons-vue'
import { IndexDB } from '../../store/indexDB'
import { ref ,onMounted} from 'vue'
import { mavonEditor } from 'mavon-editor'
import 'mavon-editor/dist/css/index.css'
import {userheaders} from '../../store/urlStore'
import {contentheaders} from '../../store/contentStore'
import { storeToRefs } from 'pinia'
import dayjs from 'dayjs'
import relativeTime from 'dayjs/plugin/relativeTime'
import 'dayjs/locale/zh-cn' // 中文
dayjs.extend(relativeTime)
dayjs.locale('zh-cn') 
const headers = userheaders();
const contentheader = contentheaders();
 
const {content,driftName,contentimage,contentid}=storeToRefs(contentheader);
const { token } = storeToRefs(headers);
const editValue = ref(content.value)
const searchname=ref(driftName.value)
const ContentImage = ref(contentimage.value)
// 路由
const router = useRouter();
const imageUp = ref(false)
const toolbars = {
  bold: true,
  italic: true,
  header: true,
  underline: true,
  strikethrough: true,
  mark: true,
  superscript: true,
  subscript: true,
  quote: true,
  ol: true,
  ul: true,
  link: true,
  imagelink: true,
  code: true,
  table: true,
  fullscreen: true,
  readmodel: false,  // 也禁用沉浸式阅读
  help: true,
  undo: true,
  redo: true,
  trash: true,
  save: true,
  subfield: false,
  navigation: true, // 禁用导航目录
  alignleft: true,
  aligncenter: true,
  alignright: true,
}
// 下面的方法是我用来获取mavonEditor实例的方法
//在 标签上面也需要使用 ref=md

defineEmits(['save', 'imgAdd', 'imgDel'])
const md = ref()
// const markdownIt = this.refs.md.getMarkdownIt()
//下面我进行的是driftpage 的保存以及之后的网络请求保存提交
async function save(){
 const indexdb = new IndexDB('myDatabase',1,'driftPage')
 await indexdb.init('name')
 await indexdb.add({ 
          
          name: searchname.value, 
         content: editValue.value
        })
indexdb.close()

}
// 处理图片添加的事件
const handleImgAdd = async (pos, file) => {
  // 1. 创建 FormData
  const formData = new FormData()
  formData.append('file', file)
  
  try {
    // 2. 上传到服务器（替换为你的上传接口）
    const response = await fetch('http://localhost:8080/save', {
      method: 'POST',
      body: formData,
    })
    
    
      const data = await response.json()
      // 3. 成功后返回图片URL
      const imageUrl = data.url
      console.log(imageUrl)
   
      // 4. 将图片插入编辑器
      setTimeout(()=>md.value.$img2Url(pos,imageUrl),3000)
     
  } catch (error) {
    console.error('上传图片失败:', error)
  }
}

// 处理图片删除事件
const handleImgDel = async(pos) => {
  console.log('删除图片位置:',pos[0] )
 const fileName = pos[0].split('/').pop();
 
  console.log(fileName)
 try{
  const response = await fetch('http://localhost:8080/del',{
    method:'Post',
    headers:{'Content-Type': 'application/json'},
    body: JSON.stringify({"fileName":fileName})
  })
  const data = await response.json()
  if(data){
    alert("删除成功");
  }else{
    alert("删除失败");
  }
}catch(error){
   alert("服务器或者网络异常")
}
  
 
}

// 这里执行我的contentImage 封面显示的属性！！
const shows = ref('none')
const publishImage=()=>{
  shows.value=""

}
// 下面为我的不显示的事件,并且还要执行我的删除逻辑
const xugai=()=>{
  if(ContentImage.value!=''){ shows.value='none'}
  else{
    delCover()
  shows.value='none'
  }
}
//下面我定义我的图标点击delete事件
function delIcon(){
delCover()}
// 下面执行我的封面上传事件

const handleAvatarSuccess = async (response, uploadFile, uploadFiles)=>{

 setTimeout(()=>ContentImage.value=response.url,4000)
 console.log(uploadFile)
 imageUp.value=true
ElMessage("文件上传成功")
}
// 下面处理我的封面的删除事件
async function delCover(){
  if(ContentImage.value!=''){
   const fileName= ContentImage.value.split('/').pop();
  const response = await fetch('http://localhost:8080/delCover',{
    method:'Post',
    headers:{'Content-Type': 'application/json'},
    body: JSON.stringify({"fileName":fileName})
  })
  const data = await response.json()
  if(data){
    ContentImage.value=''
    imageUp.value=false
   ElMessage("删除成功");
  }else{
    ElMessage("删除失败");
  }
  }
}

//处理发布事件
async function publish(){
  if(contentid.value!=''){
    console.log(contentid.value)
    const formattedTime = ref(dayjs().format('YYYY-MM-DD'))
    const user={contentid:contentid.value,content: editValue.value,driftName:searchname.value,time:formattedTime.value,contentImage: ContentImage.value}
    const wq = await fetch('http://localhost:8080/updateContent', {
    method: 'Post',
    headers: { 
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token.value}` },
        body: JSON.stringify(user)
});
if(wq.ok){
      console.log('/update 请求已返回，准备解析 json');
      const data = await wq.json();
      if(data){
        ElMessage("修改成功")
         contentheader.$patch((state)=>{
        state.content=''
        state.contentid=''
        state.contentimage=''
        state.driftName=''
    })       
          router.push('/nav')
       
      }
}
  }else{
  const formattedTime = ref(dayjs().format('YYYY-MM-DD'))
const user={content: editValue.value,driftName:searchname.value,time:formattedTime.value,contentImage: ContentImage.value}
console.log(ContentImage.value)
  const wq = await fetch('http://localhost:8080/saveContent', {
    method: 'Post',
    headers: { 
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token.value}` },
        body: JSON.stringify(user)
});
console.log(JSON.stringify(user))
 if(wq.ok){
      console.log('/saveCoent 请求已返回，准备解析 json');
      const data = await wq.json();
      if(data){
        ElMessage("发布成功")
        router.push('/nav')
      }
}
  }
}

</script>
<style scoped>
  .ContentPicture{
    position:absolute;
    background-color:rgb(225, 234, 234);
    height: 60vh;
    width: 50vw;
    bottom:1px;
    left:30vw;
    z-index: 2000;
    
    box-shadow: var(--el-border-color-light) 0px 0px 10px;
  }
  .buttondiv{
    display:flex;
    justify-content: flex-end;
    align-items: center;
  }
  .avatar-uploader {
  width: 200px;  
  height: 100px; 
  border: 1px dashed #d9d9d9;
  border-radius: 6px;
  cursor: pointer;
  position: absolute;
  left:150px;
  top:50px;
   display: flex;
  justify-content: center;
  align-items: center;
  transition: var(--el-transition-duration-fast);
}
.fengmian{
  position: relative;
  top:50px;
  right:40px
}
.cancel{
  position:absolute;
  top:10px;
  right:10px
}
.fangbu{
  position: absolute;
  bottom:20px;
  right:30px;
}
.deleteIcon{
  position:absolute;
  left:23vw;
  top:5vh;
  z-index: 4000;
  
  
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

</style>