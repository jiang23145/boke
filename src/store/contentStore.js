import {defineStore} from 'pinia'
import { ref, computed } from 'vue'
export const contentheaders=defineStore('Content',()=>{
const content=ref('')
const contentimage=ref('')
const driftName= ref('')
const contentid = ref('')

function resetStore(){
    console.log("我执行到了这里123")
    // this.$reset()
    
}
return {content,driftName,contentimage,contentid,resetStore}
},{
    persist:{
    key: 'Content',
    paths: ['content']
    }
}
)