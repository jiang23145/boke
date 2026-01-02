<template>

  <div class="makedownMain" style="width:100vw;height:100vh">
    <div class="main">
    <div class="side"></div>
    <div class="main1">
  <el-scrollbar>
  <div class="title"><h1>{{ driftName }}</h1></div>
  <div class="content">
  <div v-html="htmlContent"></div>
  </div>
  </el-scrollbar>
  </div>
  </div>
  </div>
</template>

<script setup>
import { ref, onMounted} from 'vue'
import { marked } from 'marked'
import { userheaders } from '../../store/urlStore'
import { storeToRefs } from 'pinia'

const headers = userheaders()
const { content ,driftName} = storeToRefs(headers)
const htmlContent = ref('')



const renderer = new marked.Renderer()
renderer.image = function({ href, title, text }) {
  // href是图片URL，text是alt文本
  const altText = text || '图片'
  const escapedText = altText.toLowerCase().replace(/[^\w]+/g, '-')
  
  return `
    <img src="${href}" 
         alt="${escapedText}" 
         class="custom-markdown-image"
          ">
  `
}

marked.setOptions({
  renderer: renderer
})

onMounted(() => {
  if (content.value) {
    // 将markdown转换为HTML
    htmlContent.value = marked.parse(content.value)
    
  }})
</script>

<style>
  .title{
    margin-bottom: 5vh;
    
  }
.makedownMain{
  display:flex;
  
  overflow-y: auto;
  justify-content: center;
}
.main{
width:80vw;
box-shadow: var(--el-border-color-light) 0px 0px 10px;
display: flex;

}
.main1{
  width:65vw;
  height:100vh;
 
  box-shadow: var(--el-border-color-light) 0px 0px 10px;
  
}
img.custom-markdown-image {
  max-width: 40vw !important;
  height: auto !important;
  object-fit: contain !important;
  display: block !important;
  margin: 10px 0 !important;
  border-radius: 4px !important;
  box-shadow: 0 2px 8px rgba(0,0,0,0.1) !important;
}

.side{
  width:15vw;
  height:100vh;
  background-color:aliceblue;
}
.content{
  display: flex;
  height: inherit;
  width: inherit;
  justify-content: center;
}

</style>