<template>
  <mavon-editor :style="{'height':'700px'}" ref='md'
    :toolbar="toolbars" 
    v-model="editValue" 
    @save="save" 
    :ishljs="true" 
    placeholder="开始进行二零"
    :subfield="false"
    :preview="false"
    defaultOpen="edit"
    :boxShadow="false"
  />
  <div class="d-flex justify-content-center align-items-center gap-3 py-3">
  <button class="btn btn-success px-4" @click="saveDraft">
    <i class="bi bi-save me-2"></i>保存草稿
  </button>
  <button class="btn btn-danger px-4" @click="publish">
    <i class="bi bi-send me-2"></i>发布文档
  </button>
</div>
</template>

<script setup>
import { IndexDB } from '../../store/indexDB'
import { ref ,onMounted} from 'vue'
import { mavonEditor } from 'mavon-editor'
import 'mavon-editor/dist/css/index.css'

const editValue = ref('')

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
  navigation: true, // 禁用导航目录
  alignleft: true,
  aligncenter: true,
  alignright: true,
}
// 下面的方法是我用来获取mavonEditor实例的方法
//在 标签上面也需要使用 ref=md

// const markdownIt = this.refs.md.getMarkdownIt()
//下面我进行的是driftpage 的保存以及之后的网络请求保存提交
async function save(){
 const indexdb = new IndexDB('myDatabase',1,'driftPage')
 await indexdb.init('name')
 await indexdb.add({ 
          id: 1, 
          name: 'John Doe', 
          email: 'john@example.com' 
        })
indexdb.close()

}
// async function save() {
//     const request = indexedDB.open('myDatabase', 1);
//     // 只在数据库创建或升级时执行
//     request.onupgradeneeded = function(event) {
//       const db = event.target.result;
      
//       // 如果 driftPage 不存在，创建它
//       if (!db.objectStoreNames.contains('driftPage')) {
//         const objectStore = db.createObjectStore('driftPage', { keyPath: 'id' });
//         objectStore.createIndex('name', 'name', { unique: false });
//         console.log("对象存储创建成功");
//       }
//     };

//     request.onsuccess = function(event) {
//       const db = event.target.result;
//       console.log("数据库打开成功");
      
//       try {
//         // 检查对象存储是否存在
//         if (!db.objectStoreNames.contains('driftPage')) {
//           throw new Error('对象存储 driftPage 不存在');
//         }
        
//         // 开始事务
//         const transaction = db.transaction(['driftPage'], 'readwrite');
//         const objectStore = transaction.objectStore('driftPage');
        
//         // 添加数据
//         const addRequest1 = objectStore.add({ 
//           id: 1, 
//           name: 'John Doe', 
//           email: 'john@example.com' 
//         });
        
//         const addRequest2 = objectStore.add({ 
//           id: 2, 
//           name: 'Jane Doe', 
//           email: 'jane@example.com' 
//         });
        
//         // 监听事务完成
//         transaction.oncomplete = function() {
//           console.log("数据保存成功");
//           db.close();
          
//         };
        
//         transaction.onerror = function(event) {
//           console.error("事务错误:", event.target.error);
          
//         };
        
//       } catch (error) {
//         console.error("保存数据时出错:", error);
       
//       }
//     };

//     request.onerror = function(event) {
//       console.error("数据库打开失败:", event.target.error);
    
//     };
//   };


</script>