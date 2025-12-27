import {defineStore} from 'pinia'
import { ref, computed } from 'vue'
export const contentheaders=defineStore('Content',()=>{
const content=ref('')
const contentimage=ref('')
const driftName= ref('')
const contentid = ref('')

function reset(){
    console.log("我执行到了这里")
     this.$reset()
    
}
return {content,driftName,contentimage,contentid,reset}
},{
    persist:{
    key: 'co',
    paths: ['content']
    }
}
)